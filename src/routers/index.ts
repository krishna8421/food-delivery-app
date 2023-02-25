import { Router } from "express";
import vendorRouter from "./vendor";
import customerRouter from "./customer";

const router = Router();

router.use("/vendor", vendorRouter);
router.use("/customer", customerRouter);


export default router;
