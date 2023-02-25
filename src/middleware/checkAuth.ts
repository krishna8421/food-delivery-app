import { Response, Request } from "express";
import jwt from "jsonwebtoken";

export const checkAuth = (req: Request, res: Response, next: () => void) => {
  const authorizationHeader = req.headers.authorization;

  const role = req.baseUrl.split("/")[1];

  if (!authorizationHeader) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    if ((decoded as any).role !== role) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }
    req.body.user = decoded;
  } catch (err) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }
  next();
};
