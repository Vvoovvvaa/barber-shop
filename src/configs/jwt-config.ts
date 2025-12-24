import { registerAs } from "@nestjs/config";

export const jwtConfig = registerAs("JWT_CONFIG", () => {
  return {
    tempSecret: process.env.JWT_SECRET2!,
    expiresIn: Number(process.env.JWT_EXPIRES_IN),
    secret: process.env.JWT_SECRET!,
  };
});