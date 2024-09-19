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
import { Button } from "@/components/ui/button";
import { MdAddAPhoto } from "react-icons/md";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { z } from "zod";
import createNewAwardMoney from "@/app/schema/createNewAwardMoney";
import { CreateAwardMoneyType } from "@/types/CreateAwardMoneyType";
import { v4 as uuidv4 } from "uuid";

type CreateNewRuffle = z.infer<typeof createNewAwardMoney>;

interface Props {
  sendData: (data: CreateAwardMoneyType) => void;
}

const AwardMoney: FC<Props> = (props) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<CreateNewRuffle>({
    resolver: zodResolver(createNewAwardMoney),
    defaultValues: {
      Title: "",
      Value: "",
      Image: "",
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("AwardMoney");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      form.reset(parsedData);
    }
  }, [form]);

  const onSubmit = async (data: CreateNewRuffle) => {
    try {
      const generatedId = uuidv4(); // Utilizando a função uuidv4 corretamente

      // Cria um objeto que segue o tipo CreateAwardMoneyType
      const createAwardMoneyData: CreateAwardMoneyType = {
        Id: generatedId,
        Title: data.Title,
        Value: data.Value,
        // Inclua a imagem como string ou mantenha o arquivo se necessário
        Image: selectedFile ? selectedFile : null,
      };

      // Armazena os dados no localStorage se necessário
      localStorage.setItem("formData", JSON.stringify(createAwardMoneyData));
      localStorage.setItem("AwardMoney", JSON.stringify(createAwardMoneyData));

      // Envia os dados
      props.sendData(createAwardMoneyData);
    } catch (error) {
      console.error("Erro durante a submissão:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setSelectedFile(file);
    }
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
                <FormField
                  control={form.control}
                  name="Value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Valor do prêmio
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Valor do prêmio" {...field} />
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

            <FormField
              control={form.control}
              name={`Image`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <label
                    htmlFor={`image-upload`}
                    className="cursor-pointer bg-gray-200 flex justify-center items-center w-full h-5/6 p-14 rounded-xl relative"
                  >
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt="Preview"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-xl shadow-2xl"
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