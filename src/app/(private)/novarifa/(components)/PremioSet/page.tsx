import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CreateAwardSet from "./create";
import GetLocalStorage from "@/app/utils/utils";
import createNewAwardProduct from "@/app/schema/createNewAwardProduct";
import createNewAwardMoney from "@/app/schema/createNewAwardMoney";

type CreateRifaFormType = z.infer<typeof createNewAwardProduct>;
type CreateNewRuffle = z.infer<typeof createNewAwardMoney>;

const AwardSet: React.FC = () => {
  const [create, setCreate] = useState<boolean>(false);
  const [awardItems, setAwardItems] = useState<
    (CreateRifaFormType | CreateNewRuffle)[]
  >([]);

  useEffect(() => {
    const awardProd = GetLocalStorage("AwardItem");
    const awardMoney = GetLocalStorage("AwardMoney");

    if (awardProd) {
      const parsedAwardProd = JSON.parse(awardProd) as CreateRifaFormType;
      setAwardItems((prevItems) => {
        const alreadyExists = prevItems.some(
          (item) => item.Title === parsedAwardProd.Title
        );
        return alreadyExists ? prevItems : [...prevItems, parsedAwardProd];
      });
    }

    if (awardMoney) {
      const parsedAwardMoney = JSON.parse(awardMoney) as CreateNewRuffle;
      setAwardItems((prevItems) => {
        const alreadyExists = prevItems.some(
          (item) => item.Title === parsedAwardMoney.Title
        );
        return alreadyExists ? prevItems : [...prevItems, parsedAwardMoney];
      });
    }
  }, []);

  console.log(awardItems, " aqui");

  return (
    <div className="w-full h-full">
      {!create ? (
        <div className="text-3xl font-semibold flex justify-center items-center flex-col gap-4 w-full h-full">
          {awardItems.length > 0 ? (
            <div className="w-full flex flex-col items-center gap-4">
              <h1>Lista de Prêmios Cadastrados</h1>
              {awardItems.map((item, index) => (
                <div
                  key={index}
                  className="w-full max-w-md p-4 border rounded-lg shadow-lg"
                >
                  <h2 className="text-2xl font-bold">{item.Title}</h2>
                  {("Description" in item && item.Description) && (
                    <p>{item.Description}</p>
                  )}
                  {("Value" in item && item.Value) && (
                    <p>Valor: {item.Value}</p>
                  )}
                  {/* Outros campos podem ser adicionados aqui */}
                </div>
              ))}
            </div>
          ) : (
            <>
              <h1>Cadastre um Prêmio</h1>
              <Button
                type="submit"
                onClick={() => {
                  setCreate(true);
                }}
                className="rounded-xl p-6 font-semibold"
              >
                Cadastrar
              </Button>
            </>
          )}
        </div>
      ) : (
        <CreateAwardSet />
      )}
    </div>
  );
};

export default AwardSet;
