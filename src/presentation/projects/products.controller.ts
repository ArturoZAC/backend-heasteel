import { Request, Response } from "express";
import path from "path";
import fs from "fs";

import { prisma } from "../../data";
import { CreateProductDto } from "../../domain/dtos/product/createProduct.dto";
import { UpdateProductDto } from "../../domain/dtos/product/updateProduct.dto";

export class ProjectsController {
  private findProductByIdOrFail = async (idProduct?: string) => {
    if (!idProduct) {
      throw { status: 400, message: "'idProdut' param is required" };
    }

    const product = await prisma.project.findUnique({
      where: {
        id: idProduct!,
      },
    });

    if (!product) {
      throw { status: 404, message: "product not found" };
    }

    return product;
  };

  public getAllProducts = async (req: Request, res: Response) => {

    // return res.status(200).json({ ok: true });
    const allProducts = await prisma.project.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json(allProducts);
  };

  public deleteProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.findProductByIdOrFail(req.params.idProduct);
      await prisma.project.delete({
        where: {
          id: product.id,
        },
      });
      const imagePath = path.resolve(
        __dirname,
        "../../../images",
        product.image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      return res.status(200).json(product);
    } catch (error: any) {
      return res
        .status(error.status)
        .json({ error: error.message || "Internal Error" });
    }
  };

  public getOneProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.findProductByIdOrFail(req.params.idProduct);
      return res.status(200).json(product);
    } catch (error: any) {
      return res
        .status(error.status)
        .json({ error: error.messa || "Internal Error" });
    }
  };

  public createProduct = async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Imagen requerida" });
    }

    const { title } = req.body;
    const [error, createProductDto] = CreateProductDto.create({
      title,
      image: file.filename,
    });

    if (error) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error });
    }

    const responseProduct = await prisma.project.create({
      data: createProductDto!,
    });

    return res.status(201).json(responseProduct);
  };

  public updateProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.findProductByIdOrFail(req.params.idProduct);
      const { title } = req.body;
      const file = req.file;

      const [error, updateProductDto] = UpdateProductDto.update({
        title: title ?? product.title,
        image: file ? file.filename : product.image,
      });

      if (error) {
        if (file) fs.unlinkSync(file.path);
        return res.status(400).json({ error });
      }

      if (file && product.image !== file.filename) {
        const oldImagePath = path.resolve(
          __dirname,
          "../../../images",
          product.image
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const updatedProduct = await prisma.project.update({
        where: { id: product.id },
        data: updateProductDto!,
      });

      return res.status(200).json(updatedProduct);
    } catch (error: any) {
      const statusCode = error?.status ?? 500;
      return res
        .status(statusCode)
        .json({ error: error.message || "Internal Error" });
    }
  };
}
