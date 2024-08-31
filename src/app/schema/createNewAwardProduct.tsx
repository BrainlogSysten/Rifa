import { z } from "zod";

const createNewAwardProduct = z.object({
  title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  image1: z.any().optional(),
  image2: z.any().optional(),
  image3: z.any().optional(),
  image4: z.any().optional(),
});

export default createNewAwardProduct;
