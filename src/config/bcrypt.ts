import { compare, genSalt, hash } from "bcrypt";

export class Bcrypt {
  public static hash = async (password: string) => {
    const salt = await genSalt();
    return hash(password, salt);
  };

  public static compare = async (password: string, hashed: string) => {
    return compare(password, hashed);
  };
}
