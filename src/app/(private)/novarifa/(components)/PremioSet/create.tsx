import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import AwardObject from "./typeAward/AwardObject";
import AwardMoney from "./typeAward/AwardMoney";
import createNewAwardProduct from "@/app/schema/createNewAwardProduct";
import createNewAwardMoney from "@/app/schema/createNewAwardMoney";
import { z } from "zod";
import { CreateAwardMoneyType } from "@/types/CreateAwardMoneyType";
import { CreateAwardtype } from "@/types/CreateAwardtype";
import { v4 as uuidv4 } from "uuid";  // Importa a função para gerar o ID

// Tipos baseados nos esquemas Zod
type CreateProdAward = z.infer<typeof createNewAwardProduct>;
type CreateMoneyAward = z.infer<typeof createNewAwardMoney>;

interface Props {
  sendData: (data: (CreateAwardMoneyType | CreateAwardtype)[]) => void;
}

const CreateAwardSet: React.FC<Props> = (props) => {
  const [typeAward, setTypeAward] = useState<"produtos" | "dinheiro">("produtos");
  const [dataSet, setDataSet] = useState<(CreateAwardMoneyType | CreateAwardtype)[]>([]);

  // Função para adicionar itens convertendo para os tipos corretos
  const addItemToList = (item: CreateProdAward | CreateMoneyAward) => {
    setDataSet((prevDataSet) => {
      if ("Id" in item) {
        const isDuplicate = prevDataSet.some((existingItem) => "Id" in existingItem && existingItem.Id === item.Id);

        if (isDuplicate) {
          return prevDataSet;
        }
      }
      let newItem: CreateAwardtype | CreateAwardMoneyType;
      if ("Value" in item) {
        newItem = {
          ...item,
          Id: uuidv4(), // Atribui o ID gerado
          tagType: "Money",
        } as CreateAwardMoneyType;
      } else {
        newItem = {
          ...item,
          Id: uuidv4(), // Atribui o ID gerado
          tagType: "Product",
        } as CreateAwardtype;
      }

      // Salva o novo item no localStorage
      const updatedDataSet = [...prevDataSet, newItem];
      localStorage.setItem("awards", JSON.stringify(updatedDataSet));

      return updatedDataSet;
    });
  };

  useEffect(() => {
    if (dataSet.length > 0) {
      props.sendData(dataSet);
    }
  }, [dataSet]);

  return (
    <div className="h-full">
      <Select
        onValueChange={(value: string) => setTypeAward(value as "produtos" | "dinheiro")}
        value={typeAward}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="produtos">Prêmio em produtos</SelectItem>
          <SelectItem value="Money">Prêmio em dinheiro</SelectItem>
        </SelectContent>
      </Select>

      {typeAward === "produtos" ? (
        <AwardObject sendData={(data) => addItemToList(data)} />
      ) : (
        <AwardMoney sendData={(data) => addItemToList(data)} />
      )}
    </div>
  );
};

export default CreateAwardSet;
