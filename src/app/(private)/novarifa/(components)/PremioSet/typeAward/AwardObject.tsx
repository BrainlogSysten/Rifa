import React, { FC, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MdAddAPhoto } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import createNewAwardMoney from '@/app/schema/createNewAwardMoney';

// Tipo ajustado
type CreateRifaFormType = z.infer<typeof createNewAwardMoney>;

interface Props {
  sendData?: (data: FormData) => void;
}

const AwardObject: FC<Props> = ({ sendData }) => {
  const form = useForm<CreateRifaFormType>({
    resolver: zodResolver(createNewAwardMoney),
    defaultValues: {
      title: "",
      description: "",
      image1: null,
      image2: null,
      image3: null,
      image4: null,
    },
  });

  const onSubmit = async (data: CreateRifaFormType) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);

      // Adicionando as imagens ao FormData
      for (let i = 1; i <= 4; i++) {
        const imageFile = data[`image${i}` as keyof CreateRifaFormType];
        if (imageFile) {
          formData.append(`image${i}`, imageFile[0]);
        }
      }

      sendData && sendData(formData); // Enviando FormData para a função sendData
    } catch (error) {
      console.error("Erro durante a submissão:", error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-2 gap-5 flex justify-center"
        >
          <div className="w-full flex flex-col gap-6 h-3/6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Nome do prêmio
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Título do prêmio" {...field} />
                  </FormControl>
                  <FormDescription>
                    Este é o nome do prêmio que os participantes irão ver
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
                    Descrição do prêmio
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição do prêmio" {...field} />
                  </FormControl>
                  <FormDescription>
                    Esta é a descrição do prêmio que os participantes irão ver
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Cadastrar</Button>
          </div>

          <div className="w-full flex flex-col items-center gap-5 p-7 bg-white rounded-xl shadow-xl h-4/5">
            <h1 className="text-xl font-semibold text-left w-full">
              Selecione as imagens do seu prêmio
            </h1>
            <div className="w-full flex justify-center items-center">
              {[...Array(4)].map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`image${index + 1}` as keyof CreateRifaFormType}
                  render={({ field }) => (
                    <FormItem>
                      <label
                        htmlFor={`image-upload-${index + 1}`}
                        className="cursor-pointer bg-gray-200 flex justify-center items-center w-full h-5/6 p-14 rounded-xl"
                      >
                        <MdAddAPhoto size={30} />
                      </label>
                      <input
                        id={`image-upload-${index + 1}`}
                        type="file"
                        accept="image/*"
                        {...field}
                        className="hidden"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AwardObject;
