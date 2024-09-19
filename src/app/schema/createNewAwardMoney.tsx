import { z } from "zod";

const createNewAwardMoney = z.object({
  Id: z.string().uuid({
    message: "O ID deve ser um UUID válido.",
  }).optional(),
  Description: z.string().optional(),
  Title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  Value: z.string().min(2, {
    message: "formato invalido",
  }),
  Image: z.any().optional(),
  tagType: z.literal("Dinheiro"),
});

export default createNewAwardMoney;
