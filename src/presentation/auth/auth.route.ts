import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AuthRoute {
  public static routes = () => {
    const router = Router();
    const authController = new AuthController();
    const authMiddleware = new AuthMiddleware();

    router.get("/", authController.getAllUsers);
    router.post("/", authController.createUser);
    router.get(
      "/generate-token",
      [authMiddleware.validateJWT],
      authController.generateToken
    );
    router.post("/login", authController.loginUser);

    return router;
  };
}
