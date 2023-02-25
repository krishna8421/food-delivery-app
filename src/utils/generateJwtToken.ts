import jwt from "jsonwebtoken";

interface IGenerateJwtToken {
  id: string;
  role: string;
}

export const generateJwtToken = ({ id, role }: IGenerateJwtToken) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "30d",
    }
  );
};
