import jwt, { SignOptions } from "jsonwebtoken";
import { envs } from "./envs";

export class Jwt {
  public static signJWT = (payload: any, duration: string = "1d") => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        envs.JWT_SEED,
        { expiresIn: duration } as SignOptions,
        (error, encoded) => {
          if (error) return reject(null);

          return resolve(encoded);
        }
      );
    });
  };

  public static verifyJWT = <T>(token: string): Promise<T | null> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, envs.JWT_SEED, (error, decoded) => {
        if (error) return reject(null);

        return resolve(decoded as T);
      });
    });
  };
}
