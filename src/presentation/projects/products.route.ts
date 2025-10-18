import { Router } from "express";
import { upload } from "../../config/multer";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ProjectsController } from "./products.controller";

export class ProductsRoute {
  public static routes = () => {
    const projectsController = new ProjectsController();
    const router = Router();
    const authMiddleware = new AuthMiddleware();

    router.use(authMiddleware.validateJWT);

    router.get("/", projectsController.getAllProducts);
    router.post("/", upload.single("image"), projectsController.createProduct);
    router.get("/:idProduct", projectsController.getOneProduct);
    router.delete("/:idProduct", projectsController.deleteProduct);
    router.put(
      "/:idProduct",
      upload.single("image"),
      projectsController.updateProduct
    );
    return router;
  };
}
