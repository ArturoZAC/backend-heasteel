import z from "zod";

export class CreateProductDto {
  constructor(public readonly title: string, public readonly image: string) {}

  public static schema = z.object({
    title: z
      .string("El titulo es requerido")
      .min(2, { error: "El nombre debe tener al menos 2 caracteres" }),
    image: z.string(),
  });

  public static create = (object: z.infer<typeof CreateProductDto.schema>) => {
    const result = this.schema.safeParse(object);

    if (!result.success) {
      return [result.error.issues[0]?.message, undefined] as const;
    }

    const { title, image } = result.data;

    return [undefined, new CreateProductDto(title, image)] as const;
  };
}
