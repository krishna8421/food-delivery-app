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
      message: "Vendor already exists",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = await prisma.vendor.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateJwtToken({
      id: vendor.id,
      role: "vendor",
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

  const vendor = await prisma.vendor.findUnique({
    where: {
      email,
    },
  });

  if (!vendor) {
    return res.status(400).json({
      status: "error",
      message: "Vendor does not exist",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, vendor.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      status: "error",
      message: "Invalid credentials",
    });
  }

  const token = generateJwtToken({
    id: vendor.id,
    role: "vendor",
  });

  return res.status(200).json({
    status: "ok",
    token,
  });
});

router.post("/create-menu", checkAuth, async (req: Request, res: Response) => {
  const { name, description, price, imgUrl } = req.body;
  const vendorId = req.body.user.id;
  if (!name || !description || !price || !imgUrl) {
    return res.status(400).json({
      status: "error",
      message: "Please fill all the fields",
    });
  }

  try {
    const menu = await prisma.menuItems.create({
      data: {
        name,
        description,
        price,
        imgUrl,
        vendorId,
      },
    });

    return res.status(200).json({
      status: "ok",
      menu,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
});

export default router;
