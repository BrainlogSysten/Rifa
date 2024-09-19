import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CreateAwardSet from "./create";
import createNewAwardProduct from "@/app/schema/createNewAwardProduct";
import createNewAwardMoney from "@/app/schema/createNewAwardMoney";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Typography from '@mui/material/Typography';



type CreateRifaFormType = z.infer<typeof createNewAwardProduct>;
type CreateNewRuffle = z.infer<typeof createNewAwardMoney>;

const AwardSet: React.FC = () => {
  const [create, setCreate] = useState<boolean>(false);
  const [awardItems, setAwardItems] = useState<
    (CreateRifaFormType | CreateNewRuffle)[]
  >([]);

  const handleSendData = (data: (CreateRifaFormType | CreateNewRuffle)[]) => {
    setAwardItems((prevItems) => [...prevItems, ...data]);
    setCreate(false);
  };

  return (
    <div className="w-full h-full">
      {!create ? (
        <div className="text-3xl font-semibold flex justify-center items-center flex-col gap-4 w-full h-full">
          {awardItems.length > 0 ? (
            <div className="w-full flex flex-col items-center gap-4">
              <h1>Lista de Prêmios Cadastrados</h1>
              {awardItems.map((item, index) => (
                <Card className="w-80 shadow-lg rounded-lg overflow-hidden" key={index}>
                <CardHeader>
                  <img src={item.image1} alt="Imagem" className="w-full h-40 object-cover" />
                </CardHeader>
                <CardContent className="p-4">
                  <Typography variant="h5" className="font-semibold mb-2">
                    {item.Title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.Description}
                  </Typography>
                </CardContent>
              </Card>
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-4">
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
            </div>
          )}
        </div>
      ) : (
        <CreateAwardSet sendData={handleSendData} />
      )}
    </div>
  );
};

export default AwardSet;
