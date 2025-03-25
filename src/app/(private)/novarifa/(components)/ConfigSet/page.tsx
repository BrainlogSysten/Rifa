"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CreateNewRuffleSchema from "@/app/schema/CreateNewRuffle";
import { z } from "zod";

type CreateNewRuffle = z.infer<typeof CreateNewRuffleSchema>;

interface Props {
  sendData: (data: FormData) => void;
  ExistAward: boolean;
}

const ConfigSet: React.FC<Props> = (props) => {
  const form = useForm<CreateNewRuffle>({
    resolver: zodResolver(CreateNewRuffleSchema),
    defaultValues: {
      title: "",
      raffleType: "cartela_de_numeros",
      startDate: "",
      endDate: "",
      description: "",
      terms: "",
      ticketPrice: 0,
      maxTicketsPerUser: 1,
      maxParticipants: 1,
      paymentMethod: "pix",
    },
  });

  console.log(props.ExistAward,"aqui ")

  useEffect(() => {
    // Carregar dados do localStorage se existirem
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      form.reset(parsedData);
    }
  }, [form]);

  const onSubmit = async (data: CreateNewRuffle) => {
    try {
      // Salvar dados no localStorage
      localStorage.setItem("formData", JSON.stringify(data));
      let formData = new FormData();
      formData.append("title", data.title);
      formData.append("raffleType", data.raffleType);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      formData.append("description", data.description || "");
      formData.append("terms", data.terms || "");
      formData.append("ticketPrice", data.ticketPrice.toString());
      formData.append("maxTicketsPerUser", data.maxTicketsPerUser.toString());
      formData.append("maxParticipants", data.maxParticipants.toString());
      formData.append("paymentMethod", data.paymentMethod);
      return props.sendData(formData);
    } catch (error) {
      console.error("Erro durante a submissão:", error);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full overflow-y-auto"
      >
        <div className="flex flex-col gap-7 mb-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título da campanha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Descrição
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Digite sua mensagem aqui." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Termos da Rifa
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Escreva os termos aqui." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="raffleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Tipo de Rifa
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cartela_de_numeros">
                        Cartela de Números
                      </SelectItem>
                      <SelectItem value="numero_unico">
                        Bilhete Premiado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Data de Início
                  </FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="Data Inicial" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Data do Sorteio
                  </FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="Data Final" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="ticketPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Valor do Bilhete
                </FormLabel>
                <FormControl>
                  <Input placeholder="Valor do bilhete" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxTicketsPerUser"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Bilhetes por Usuário
                </FormLabel>
                <FormControl>
                  <Input placeholder="Quantidade máxima por usuário" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxParticipants"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Quantidade Máxima de Participantes
                </FormLabel>
                <FormControl>
                  <Input placeholder="Quantidade máxima de participantes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Forma de Pagamento
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">pix</SelectItem>
                      <SelectItem disabled value="Boleto">
                        Boleto
                      </SelectItem>
                      <SelectItem disabled value="Cartao">
                        Cartão de Crédito
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={!props.ExistAward}  type="submit">criar Rifa </Button>
      </form>
    </Form>
  );
};

export default ConfigSet;
