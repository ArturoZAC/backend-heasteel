import { Request, Response } from "express";
import { prisma } from "../../data";
import { Bcrypt } from "../../config/bcrypt";

import { CreateUserDto } from "../../domain/dtos/auth/createUser.dto";
import { LoginUserDto } from "../../domain/dtos/auth/loginUser.dto";
import { Jwt } from "../../config/jwt";

export class AuthController {
  public getAllUsers = async (req: Request, res: Response) => {
    try {
      const allUsers = await prisma.user.findMany();
      return res.status(200).json(allUsers);
    } catch (error) {
      return res.status(500).json({ error: "Internal Error" });
    }
  };

  public createUser = async (req: Request, res: Response) => {
    try {
      const [error, createUserDto] = CreateUserDto.createUser(req.body);
      if (error) return res.status(400).json({ error });

      const createUser = await prisma.user.create({
        data: {
          ...createUserDto!,
          password: await Bcrypt.hash(createUserDto?.password!),
        },
      });

      return res.status(201).json(createUser);
    } catch (error) {
      return res.status(500).json({ error: "Internal Error" });
    }
  };

  public loginUser = async (req: Request, res: Response) => {
    try {
      const [error, loginUserDto] = LoginUserDto.loginUser(req.body);
      if (error) return res.status(400).json({ error });

      const userExists = await prisma.user.findUnique({
        where: { email: loginUserDto!.email },
      });

      if (!userExists) return res.status(404).json({ error: "User not exist" });

      const isMath = await Bcrypt.compare(
        loginUserDto?.password!,
        userExists.password
      );

      if (!isMath) {
        return res.status(400).json({ error: "Password incorrect" });
      }

      const token = (await Jwt.signJWT({ id: userExists.id })) as string;

      return res.status(200).json({
        user: userExists,
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Error" });
    }
  };

  public generateToken = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const token = (await Jwt.signJWT({ id: userId })) as string;

    return res.status(200).json({
      user,
      token,
    });
  };
}
