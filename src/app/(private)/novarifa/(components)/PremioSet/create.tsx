import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import AwardObject from "./typeAward/AwardObject";
import AwardMoney from "./typeAward/AwardMoney";

interface Props {
  
}

const CreateAwardSet: React.FC<Props> = () => {
  const [typeAward, setTypeAward] = useState<"produtos" | "dinheiro">("produtos");

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

      {typeAward === "produtos" ? <AwardObject/> : <AwardMoney/>}
    </div>
  );
};

export default CreateAwardSet;
