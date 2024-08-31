import { z } from "zod";

const createNewAwardMoney = z.object({
  Title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  Value: z.string().min(2, {
    message: "formato invalido",
  }),
  Image: z.any().optional(),
});

export default createNewAwardMoney;
