import { Router } from "express";
import { ProductsRoute } from "./projects/products.route";
import { AuthRoute } from "./auth/auth.route";

export class AppRoute {
  public static routes = () => {
    const router = Router();
    router.use("/api/v1/projects", ProductsRoute.routes());
    router.use("/api/v1/auth", AuthRoute.routes());
    return router;
  };
}
