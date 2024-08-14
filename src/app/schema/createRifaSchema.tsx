import { z } from "zod";

const CreateRifaSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  raffleType: z.enum(["produtos", "dinheiro"], {
    required_error: "Selecione um tipo de rifa.",
  }),
  startDate: z.string().nonempty({
    message: "A data de início é obrigatória.",
  }),
  endDate: z.string().nonempty({
    message: "A data final é obrigatória.",
  }),
  description: z.string().optional(),
  image1: z.string().optional(), // Adicione campos de imagem como opcionais
  image2: z.string().optional(),
  image3: z.string().optional(),
  image4: z.string().optional(),
});

export default CreateRifaSchema;
