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

const ConfigSet: React.FC<Props> = ({ sendData, receiveData }) => {
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
              <FormLabel className="text-lg font-semibold">Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Descrição da campanha" {...field} />
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
                    <SelectItem value="lista_de_premios">
                      Lista de Prêmios
                    </SelectItem>
                    <SelectItem value="numero_unico">Número Único</SelectItem>
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

        <Button type="submit">Continuar</Button>
      </form>
    </Form>
  );
};

export default ConfigSet;
