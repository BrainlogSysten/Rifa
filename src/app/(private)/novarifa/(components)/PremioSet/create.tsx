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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MdAddAPhoto } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import CreateRifaSchema from "@/app/schema/createRifaSchema";
import { CreateAwardtype } from "@/types/CreateAwardtype";

interface Props {
  sendData: (data: FormData) => void;
}

const CreateAwardSet: React.FC<Props> = ({ sendData }) => {
  const [typeAward, setTypeAward] = useState<"produtos" | "dinheiro">("produtos");

  const form = useForm({
    resolver: zodResolver(CreateRifaSchema),
    defaultValues: {
      title: "",
      raffleType: "",
      startDate: "",
      endDate: "",
      description: "",
      image: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("raffleType", data.raffleType);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      formData.append("description", data.description);
      

      // Adicionando as imagens ao FormData
      for (let i = 1; i <= 4; i++) {
        const imageFile = data[`image${i}`]?.[0];
        if (imageFile) {
          formData.append(`image${i}`, imageFile);
        }
      }

      sendData(formData); // Enviando FormData para a função sendData
    } catch (error) {
      console.error("Erro durante a submissão:", error);
    }
  };

  return (
    <div>
      <Select
        onValueChange={(value: string) => setTypeAward(value as "produtos" | "dinheiro")}
        value={typeAward}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="produtos">Prêmio em produtos</SelectItem>
          <SelectItem value="dinheiro">Prêmio em dinheiro</SelectItem>
        </SelectContent>
      </Select>
                                             
      {typeAward === "produtos" ? (
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
                      <Input placeholder="Título da campanha" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este é o nome do produto que os compradores irão ver
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
                      Esta é a descrição do produto que os compradores irão ver
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Cadastrar</Button>
            </div>
            <div className="w-full flex flex-col items-center gap-5 p-7 bg-white rounded-xl shadow-xl h-4/5">
              <h1 className="text-xl font-semibold text-left w-full">
                Selecione as imagens do seu produto
              </h1>
              <div className="w-full flex justify-center items-center">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-gray-200 flex justify-center items-center w-full h-5/6 p-14 px-36 rounded-xl"
                      >
                        <MdAddAPhoto size={30} />
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        {...field}
                        className="hidden"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-5 w-full justify-center items-center">
                {[...Array(3)].map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`image${index + 1}`}
                    render={({ field }) => (
                      <FormItem>
                        <label
                          htmlFor={`image-upload-${index}`}
                          className="cursor-pointer bg-gray-200 flex justify-center items-center w-full h-5/6 p-14 rounded-xl"
                        >
                          <MdAddAPhoto size={30} />
                        </label>
                        <input
                          id={`image-upload-${index}`}
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
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col h-5/6 p-2 gap-5 flex justify-start items-start"
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
                name="valueAward"
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
          </form>
        </Form>
      )}
    </div>
  );
};

export default CreateAwardSet;
