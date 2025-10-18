import "dotenv/config";

type Envs = {
  PORT: number;
  JWT_SEED: string;
};

export const envs: Envs = {
  PORT: Number(process.env.PORT),
  JWT_SEED: String(process.env.JWT_SEED),
};
