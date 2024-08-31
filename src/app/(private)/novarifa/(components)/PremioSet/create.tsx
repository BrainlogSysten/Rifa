import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import AwardObject from "./typeAward/AwardObject";
import AwardMoney from "./typeAward/AwardMoney";

interface Props {}

const CreateAwardSet: React.FC<Props> = () => {
  const [typeAward, setTypeAward] = useState<"produtos" | "dinheiro">("produtos");

  const handleConfigData = (formData: FormData) => {
    const dataObject = Object.fromEntries(formData.entries());
    console.log(dataObject,"aquiiiiii");  // Manipule ou use os dados conforme necessário
  };

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
          <SelectItem value="dinheiro">Prêmio em dinheiro</SelectItem>
        </SelectContent>
      </Select>

      {typeAward === "produtos" ? <AwardObject /> : <AwardMoney sendData={(data)=>{handleConfigData(data)}} />}
    </div>
  );
};

export default CreateAwardSet;
