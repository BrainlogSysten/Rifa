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

  terms: z.string().optional(), // Termos são opcionais

  ticketPrice: z.number().min(1, {
    message: "O valor do bilhete deve ser maior que 0.",
  }), // Valida que o preço do bilhete é um número maior que 0

  maxTicketsPerUser: z.number().min(1, {
    message: "O número máximo de bilhetes por usuário deve ser pelo menos 1.",
  }), // Valida que o número máximo de bilhetes por usuário é maior que 0

  maxParticipants: z.number().min(1, {
    message: "O número máximo de participantes deve ser pelo menos 1.",
  }), // Valida que o número máximo de participantes é maior que 0

  paymentMethod: z.enum(["credit_card", "pix", "bank_transfer"], {
    required_error: "Selecione um método de pagamento.",
  }), // Valida que o método de pagamento é um dos valores permitidos
});

export default CreateNewRuffle;
