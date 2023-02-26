import { Response, Request, Router } from "express";
import vendorRouter from "./vendor";
import customerRouter from "./customer";

const router = Router();

router.use("/vendor", vendorRouter);
router.use("/customer", customerRouter);
router.get("/status", (_req: Request, res: Response) => {
  res.send("OK");
});

export default router;
