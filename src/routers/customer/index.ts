import { Response, Request, Router } from "express";
import { prisma } from "@/db";
import { generateJwtToken } from "@/utils";
import bcrypt from "bcrypt";
import { checkAuth } from "@/middleware";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Please fill all the fields",
    });
  }

  const checkVendor = await prisma.vendor.findUnique({
    where: {
      email,
    },
  });

  if (checkVendor) {
    return res.status(400).json({
      status: "error",
      message: "Customer already exists",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateJwtToken({
      id: customer.id,
      role: "customer",
    });

    return res.status(200).json({
      status: "ok",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Please fill all the fields",
    });
  }

  const customer = await prisma.customer.findUnique({
    where: {
      email,
    },
  });

  if (!customer) {
    return res.status(400).json({
      status: "error",
      message: "Customer does not exist",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, customer.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      status: "error",
      message: "Invalid credentials",
    });
  }

  const token = generateJwtToken({
    id: customer.id,
    role: "customer",
  });

  return res.status(200).json({
    status: "ok",
    token,
  });
});

router.post("/add-to-cart", checkAuth, async (req: Request, res: Response) => {
  const {
    itemsId,
    user: { id: customerId },
    quantity,
  } = req.body;

  if (!itemsId || !quantity) {
    return res.status(400).json({
      status: "error",
      message: "Please fill all the fields",
    });
  }

  const oldCart = await prisma.cart.findMany({
    where: {
      customerId,
    },
  });

  console.log(oldCart);

  const itemDetails = await prisma.menuItems.findUnique({
    where: {
      id: itemsId,
    },
  });

  if (!itemDetails) {
    return res.status(400).json({
      status: "error",
      message: "Invalid item id",
    });
  }

  const { price } = itemDetails;

  const totalPrice = price * quantity;

  const checkIfItemIsAlreadyPresent = await prisma.cart.findUnique({
    where: {
      menuItemsId: itemsId,
    },
  });

  if (checkIfItemIsAlreadyPresent) {
    const updatedCart = await prisma.cart.update({
      where: {
        id: checkIfItemIsAlreadyPresent.id,
      },
      data: {
        quantity: quantity + checkIfItemIsAlreadyPresent.quantity,
        totalPrice: totalPrice + checkIfItemIsAlreadyPresent.totalPrice,
      },
    });

    return res.status(200).json({
      status: "ok",
      updatedCart,
    });
  }

  const addToCart = await prisma.cart.create({
    data: {
      customerId,
      menuItemsId: itemsId,
      quantity,
      totalPrice,
    },
  });

  return res.status(200).json({
    status: "ok",
    addToCart,
  });
});

router.get("/place-order", checkAuth, async (req: Request, res: Response) => {
  const {
    user: { id: customerId },
  } = req.body;

  const totalOrder = await prisma.cart.findMany({});

  if (totalOrder.length >= 10) {
    return res.status(400).json({
      status: "error",
      message: "Maximum order limit reached. Please try again later",
    });
  }

  const cart = await prisma.cart.findMany({
    where: {
      customerId,
    },
  });

  if (!cart) {
    return res.status(400).json({
      status: "error",
      message: "Cart is empty",
    });
  }

  const order = await prisma.orders.create({
    data: {
      customerId,
      status: "PENDING",
      totalPrice: 0,
    },
  });

  const orderItems = cart.map((cartItem) => {
    return {
      menuItemsId: cartItem.menuItemsId,
      quantity: cartItem.quantity,
      totalPrice: cartItem.totalPrice,
      orderId: order.id,
    };
  });

  const totalPrice = orderItems.reduce((acc, item) => {
    return acc + item.totalPrice;
  }, 0);

  await prisma.orderItems.createMany({
    data: orderItems,
  });

  await prisma.orders.update({
    where: {
      id: order.id,
    },
    data: {
      totalPrice,
    },
  });

  await prisma.cart.deleteMany({
    where: {
      customerId,
    },
  });

  res.status(200).json({
    status: "ok",
  });
});

export default router;
