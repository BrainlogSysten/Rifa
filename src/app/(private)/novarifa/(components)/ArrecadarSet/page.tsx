"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  receiveData?: (data: FormData) => void;
}

const ArrecadarSet: React.FC<Props> = ({ sendData, receiveData }) => {
  const form = useForm<CreateNewRuffle>({
    resolver: zodResolver(CreateNewRuffleSchema),
    defaultValues: {
      title: "",
      raffleType: "cartela_de_numeros",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

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
      return sendData(formData);
    } catch (error) {
      console.error("Erro durante a submissão:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-5/12">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                valor do bilhete{" "}
              </FormLabel>
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
                Quantidade maxima de participantes
              </FormLabel>
              <FormControl>
                <Input placeholder="Descrição da campanha" {...field} />
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
                valor do bilhete ?
              </FormLabel>
              <FormControl>
                <Input placeholder="Descrição da campanha" {...field} />
              </FormControl>
              <FormDescription>
                valor liquido = R$30000
              </FormDescription>
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
                valor do bilhete ?
              </FormLabel>
              <FormControl>
                <Input placeholder="Descrição da campanha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Continuar</Button>
      </form>
    </Form>
  );
};

export default ArrecadarSet;
