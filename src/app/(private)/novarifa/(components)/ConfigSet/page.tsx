"use client";
import Image from "next/image";
import nature from "../../../img/nature.jpg";
import { PagamentoChart } from "@/components/graficsAnalitics/paymentGraphic";
import CardCount from "@/components/graficsAnalitics/cardCount";
import { Search, Plus, Ticket } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  raffleType: z.enum(["tipo1", "tipo2", "tipo3"], {
    required_error: "Selecione um tipo de rifa.",
  }),
  startDate: z.string().nonempty({
    message: "A data de início é obrigatória.",
  }),
  endDate: z.string().nonempty({
    message: "A data final é obrigatória.",
  }),
  description: z.string().optional(),
});

const ConfigSet: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      raffleType: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-5/12 "
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Título</FormLabel>
              <FormControl>
                <Input placeholder="Título da campanha" {...field} />
              </FormControl>
              <FormDescription>
                Este é o nome público da campanha.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Título da campanha" {...field} />
              </FormControl>
              <FormDescription>Este é a descrição do sorteio.</FormDescription>
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
                    <SelectItem value="tipo1">Tipo 1</SelectItem>
                    <SelectItem value="tipo2">Tipo 2</SelectItem>
                    <SelectItem value="tipo3">Tipo 3</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Selecione o tipo de rifa para a campanha.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Data Do Sorteio{" "}
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
