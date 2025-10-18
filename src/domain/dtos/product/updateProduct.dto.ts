import z from "zod";

export class UpdateProductDto {
  constructor(public readonly title: string, public readonly image: string) {}

  public static schema = z.object({
    title: z
      .string()
      .min(2, { error: "El nombre debe tener al menos 2 caracteres" })
      .optional(),
    image: z.string().optional(),
  });

  public static update = (object: z.infer<typeof UpdateProductDto>) => {
    const result = this.schema.safeParse(object);

    if (!result.success) {
      return [result.error.issues[0]?.message, undefined] as const;
    }

    const { title, image } = result.data;

    return [undefined, new UpdateProductDto(title!, image!)] as const;
  };
}
