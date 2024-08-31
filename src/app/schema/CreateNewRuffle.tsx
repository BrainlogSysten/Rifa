import { z } from "zod";

// Definição do esquema de validação para criação de uma nova rifa
const CreateNewRuffle = z.object({
  title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }), // Valida que o título é uma string e tem no mínimo 2 caracteres

  raffleType: z.enum(["cartela_de_numeros", "lista_de_premios", "numero_unico"], {
    required_error: "Selecione um tipo de rifa.",
  }), // Valida que o tipo de rifa é um dos valores especificados

  startDate: z.string().nonempty({
    message: "A data de início é obrigatória.",
  }), // Valida que a data de início não está vazia

  endDate: z.string().nonempty({
    message: "A data final é obrigatória.",
  }), // Valida que a data final não está vazia

  description: z.string().optional(), // Descrição é opcional
});

export default CreateNewRuffle;
