import { z } from "zod";

const createNewAwardMoney = z.object({
  Id: z.string().uuid({
    message: "O ID deve ser um UUID válido.",
  }).optional(),
  Title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  Value: z.string().min(2, {
    message: "formato invalido",
  }),
  image: z.any().optional(),
});

export default createNewAwardMoney;
