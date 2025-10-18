import z from "zod";

export class CreateUserDto {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) {}

  public static schema = z.object({
    name: z
      .string()
      .min(2, { error: "El nombre debe tener al menos 2 caracteres" }),
    email: z.email({ error: "Correo electrónico inválido" }),
    password: z
      .string()
      .min(2, { error: "La contraseña debe tener al menos 2 caracteres" }),
  });

  public static createUser = (object: z.infer<typeof CreateUserDto.schema>) => {
    const result = this.schema.safeParse(object);

    if (!result.success) {
      return [result.error.issues[0]?.message, undefined] as const;
    }

    const { name, email, password } = result.data;

    return [undefined, new CreateUserDto(name, email, password)] as const;
  };
}
