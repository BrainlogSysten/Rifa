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
import { FaRegTrashAlt } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import Image from "next/image";
import createNewAwardProduct from "@/app/schema/createNewAwardProduct";

type CreateRifaFormType = z.infer<typeof createNewAwardProduct>;

interface Props {

}

const AwardObject: FC<Props> = (props) => {
  const [previews, setPreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const form = useForm<CreateRifaFormType>({
    resolver: zodResolver(createNewAwardProduct),
    defaultValues: {
      Title: "",
      Description: "",
      image1: null,
      image2: null,
      image3: null,
      image4: null,
    },
  });

  useEffect(() => {
    // Carregar dados do localStorage se existirem
    const savedData = localStorage.getItem("AwardItem");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      form.reset(parsedData);
    }
  }, [form]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    onChange: (...event: any[]) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = imageUrl;
        return newPreviews;
      });

      onChange(e); // Passando o evento para o form hook
    }
  };

  const handleImageRemove = (index: number, onChange: (...event: any[]) => void) => {
    setPreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[index] = null;
      return newPreviews;
    });

    // Limpar o campo de arquivo correspondente
    onChange({ target: { files: null } });
  };

  const onSubmit = async (data: CreateRifaFormType) => {
    try {
      const formData = new FormData();
  
      // Garantindo que Title e Description estão definidos
      if (data.Title) {
        formData.append("Title", data.Title);
      }
  
      if (data.Description) {
        formData.append("Description", data.Description);
      }
  
      // Adicionando as imagens, se estiverem definidas
      for (let i = 1; i <= 4; i++) {
        const imageFile = data[`image${i}` as keyof CreateRifaFormType];
        if (imageFile && imageFile[0]) {
          formData.append(`image${i}`, imageFile[0]);
        }
      }
      const haveItem = localStorage.getItem("AwardItem");
      
      if(haveItem){
        
        localStorage.setItem(`AwardItem`, JSON.stringify(data));
      }
      // Salvar dados no localStorage
      
      
    } catch (error) {
      console.error("Erro durante a submissão:", error);
    }
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full gap-5 flex justify-center h-full p-4"
        >
          <div className="w-full flex flex-col gap-6 h-5/6 justify-between">
            <div className="flex flex-col gap-7 ">
              <FormField
                control={form.control}
                name="Title"
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
                name="Description"
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
            </div>

            <Button type="submit">Cadastrar</Button>
          </div>

          <div className="w-full flex flex-col items-center gap-5 p-7 bg-white rounded-xl shadow-xl h-5/6">
            <h1 className="text-xl font-semibold text-left w-full">
              Selecione as imagens do seu prêmio
            </h1>
            <div className="w-full flex flex-col items-center gap-4">
              {/* Primeira imagem no topo */}
              <FormField
                control={form.control}
                name="image1"
                render={({ field }) => (
                  <FormItem>
                    <label
                      htmlFor="image-upload-1"
                      className="cursor-pointer bg-gray-200 w-full h-48 flex justify-center items-center p-2 rounded-xl relative"
                    >
                      {previews[0] && (
                        <>
                          <FaRegTrashAlt
                            size={30}
                            className="absolute fill-red-800 top-3 right-3 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageRemove(0, field.onChange);
                            }}
                          />
                        </>
                      )}
                      {previews[0] ? (
                        <Image
                          src={previews[0] as string}
                          alt="Preview 1"
                          width={128}
                          height={128}
                          className="object-cover w-full h-full rounded-xl"
                        />
                      ) : (
                        <MdAddAPhoto size={40} />
                      )}
                    </label>
                    <input
                      id="image-upload-1"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 0, field.onChange)}
                      className="hidden"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Outras três imagens em uma linha */}
              <div className="flex justify-center items-center gap-4 w-full">
                {[...Array(3)].map((_, index) => (
                  <FormField
                    key={index + 1}
                    control={form.control}
                    name={`image${index + 2}` as keyof CreateRifaFormType}
                    render={({ field }) => (
                      <FormItem>
                        <label
                          htmlFor={`image-upload-${index + 2}`}
                          className="cursor-pointer bg-gray-200 w-full h-32 flex justify-center items-center p-2 rounded-xl relative overflow-hidden"
                        >
                          {previews[index + 1] && (
                            <FaRegTrashAlt
                              size={30}
                              className="absolute fill-red-800 top-3 right-3 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageRemove(index + 1, field.onChange);
                              }}
                            />
                          )}

                          {previews[index + 1] ? (
                            <Image
                              src={previews[index + 1] as string}
                              alt={`Preview ${index + 2}`}
                              width={128}
                              height={128}
                              className="object-cover w-full h-full rounded-xl"
                            />
                          ) : (
                            <MdAddAPhoto size={30} />
                          )}
                        </label>
                        <input
                          id={`image-upload-${index + 2}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageChange(e, index + 1, field.onChange)
                          }
                          className="hidden"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AwardObject;
