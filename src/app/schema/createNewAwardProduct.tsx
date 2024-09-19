import { z } from "zod";

const createNewAwardProduct = z.object({
  Id: z.string().uuid({
    message: "O ID deve ser um UUID válido.",
  }).optional(),
  Title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  Description: z.string().optional(),
  image1: z.any().optional(),
  image2: z.any().optional(),
  image3: z.any().optional(),
  image4: z.any().optional(),
});

export default createNewAwardProduct;
