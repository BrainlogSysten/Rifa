import React, { FC, useEffect, useState } from "react";
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
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { MdAddAPhoto } from "react-icons/md";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { z } from "zod";
import createNewAwardMoney from "@/app/schema/createNewAwardMoney";
import { v4 as uuidv4 } from "uuid";

type CreateNewRuffle = z.infer<typeof createNewAwardMoney>;

interface Props {
  sendData: (data: CreateNewRuffle) => void;
}

const AwardMoney: FC<Props> = (props) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<CreateNewRuffle>({
    resolver: zodResolver(createNewAwardMoney),
    defaultValues: {
      Title: "",
      Value: "",
      image: "",
    },
  });

  // Carrega os dados salvos no localStorage, se existirem
  useEffect(() => {
    const savedData = localStorage.getItem("AwardMoney");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      form.reset(parsedData);
    }
  }, [form]);

  // Função de envio do formulário
  const onSubmit = async (data: CreateNewRuffle) => {
    console.log("Iniciando envio de dados", data);

    try {
      const generatedId = uuidv4(); // Gera um ID único

      const createAwardMoneyData: CreateNewRuffle = {
        Id: generatedId,
        Title: data.Title,
        Value: data.Value,
        image:
          selectedFile instanceof File
            ? URL.createObjectURL(selectedFile)
            : null,
      };

      console.log("Dados prontos para envio", createAwardMoneyData);
      props.sendData(createAwardMoneyData); // Envia os dados via props
    } catch (error) {
      console.error("Erro durante a submissão:", error);
    }
  };

  // Manipula a mudança da imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Cria uma URL temporária para pré-visualização
      setPreviewImage(imageUrl); // Atualiza a pré-visualização da imagem
      setSelectedFile(file); // Armazena o arquivo de imagem selecionado
      console.log("Imagem selecionada:", file);
    }
  };

  const handleImageRemove = () => {
    setPreviewImage(null); // Remove a pré-visualização
    setSelectedFile(null); // Reseta o arquivo selecionado
  };

  const formatValue = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove todos os caracteres não numéricos
      .replace(/(\d{1,3})(\d{3})(\d{2})$/, "$1.$2,$3") // Adiciona ponto antes dos milhares e vírgula para os centavos
      .replace(/(\d)(?=(\d{3})+\.)/g, "$1."); // Adiciona pontos para os milhares
  };

  return (
    <div className="h-5/6 p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full h-full flex-col p-2 gap-5 flex justify-start items-start"
        >
          <div className="w-full flex gap-6 h-full">
            <div className="w-full flex flex-col justify-between">
              <div className="flex flex-col gap-8">
                {/* Campo Nome do Prêmio */}
                <FormField
                  control={form.control}
                  name="Title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Nome do prêmio
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Título da campanha" {...field} />
                      </FormControl>
                      <FormDescription>
                        Este é o nome do prêmio que os compradores irão ver
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campo Valor do Prêmio */}
                <FormField
                  control={form.control}
                  name="Value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Valor do prêmio
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="R$ 0,00"
                          {...field}
                          value={formatValue(field.value.toString())} // Formata o valor
                          onChange={(e) => {
                            field.onChange(e.target.value); // Atualiza o valor do campo
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Este é o valor que será entregue ao ganhador
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit">Cadastrar</Button>
            </div>

            {/* Campo para Upload de Imagem */}
            <FormField
              control={form.control}
              name={`image`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <label
                    htmlFor={`image-upload`}
                    className="cursor-pointer bg-gray-200 flex justify-center items-center w-full h-5/6 p-14 rounded-xl relative"
                  >
                    {previewImage && (
                      <FaRegTrashAlt
                        className="absolute fill-red-800 top-4 right-3 cursor-pointer z-50 w-10 h-10"
                        onClick={(e) => {
                          setPreviewImage(null);
                          setSelectedFile(null);
                        }}
                      />
                    )}
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt="Preview"
                        fill
                        style={{ objectFit: "cover" }}
                        className="object-cover w-full h-full rounded-xl"
                      />
                    ) : (
                      <MdAddAPhoto size={30} />
                    )}
                  </label>
                  <input
                    id={`image-upload`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AwardMoney;
