import z from "zod";

export class LoginUserDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  public static schema = z.object({
    email: z.email("El email es requerido"),
    password: z
      .string("El password es requerido")
      .min(1, { error: "El campo es requerido" })
      .min(2, { error: "La contraseña debe tener al menos 2 caracteres" }),
  });

  public static loginUser = (object: z.infer<typeof this.schema>) => {
    const result = this.schema.safeParse(object);

    if (!result.success)
      return [result.error.issues[0]?.message, undefined] as const;

    const { email, password } = result.data;

    return [undefined, new LoginUserDto(email, password)] as const;
  };
}
