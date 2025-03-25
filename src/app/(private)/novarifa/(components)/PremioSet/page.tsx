import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CreateAwardSet from "./create";
import { CreateAwardMoneyType } from "@/types/CreateAwardMoneyType";
import { FaRegTrashAlt } from "react-icons/fa";
import { CreateAwardtype } from "@/types/CreateAwardtype";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Typography from "@mui/material/Typography";
import Autoplay from "embla-carousel-autoplay";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { toast } from "react-toastify";


interface Props {
  sendData: (data: (CreateAwardMoneyType | CreateAwardtype)[]) => void;
}



const AwardSet: React.FC<Props> = (props) => {
  const [create, setCreate] = useState<boolean>(false);
  const [awardItems, setAwardItems] = useState<
    (CreateAwardMoneyType | CreateAwardtype)[]
  >([]);

  useEffect(()=>{
    props.sendData(awardItems);
  },[awardItems])

  // Função para salvar os prêmios no sessionStorage
  const saveAwardsToSessionStorage = (
    awards: (CreateAwardMoneyType | CreateAwardtype)[]
  ) => {
    sessionStorage.setItem("awards", JSON.stringify(awards));
  };

  // Função que manipula o envio dos dados e salva no sessionStorage
  const handleSendData = (data: (CreateAwardMoneyType | CreateAwardtype)[]) => {
    const updatedItems = [...awardItems, ...data];
    setAwardItems(updatedItems);
    saveAwardsToSessionStorage(updatedItems);
    setCreate(false);
  };

  const deleteAward = (id: string) => {
    const awards = sessionStorage.getItem("awards");

    if (awards) {
      const awardsList = JSON.parse(awards);

      const updatedAwardsList = awardsList.filter(
        (award: { Id: string }) => award.Id !== id
      );

      sessionStorage.setItem("awards", JSON.stringify(updatedAwardsList));
      setAwardItems(updatedAwardsList);

      toast(
        "Prêmio removido com sucesso! Lista atualizada:",
        updatedAwardsList
      );
    } else {
      toast("Não há prêmios armazenados no sessionStorage.");
    }
  };

  // Carregar prêmios do sessionStorage ao montar o componente
  useEffect(() => {
    const storedItems = sessionStorage.getItem("awards");
    if (storedItems) {
      setAwardItems(JSON.parse(storedItems));
    }
  }, [create]);

  return (
    <div className="w-full h-full">
      {!create ? (
        <div className="text-3xl font-semibold flex justify-center items-center flex-col gap-4 w-full h-full">
          {awardItems.length > 0 ? (
            <div className="w-full h-full flex flex-col items-center gap-4">
              <div className="flex items-center justify-center relative w-full h-14">
                <h1 className="grow flex justify-center">
                  Lista de Prêmios Cadastrados
                </h1>
                <Button
                  type="button"
                  onClick={() => setCreate(true)}
                  className="rounded-xl p-6 font-semibold"
                >
                  Cadastrar
                </Button>
              </div>

              <div className="grid grid-cols-3 overflow-y-auto w-full gap-3">
                {awardItems.map((item, index) => (
                  <Card
                    className={`w-full rounded-2xl overflow-hidden flex relative  shadow-xl cursor-pointer ${
                      item.tagType == "Money"
                        ? "border border-green-600"
                        : "border-blue-600"
                    }`}
                    key={index}
                  >
                    <Dialog>
                      <DialogTrigger>
                        <FaRegTrashAlt
                          className="absolute fill-red-800 bottom-4 right-3 cursor-pointer z-50 w-7 h-7 "
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Certeza que deseja excluir ? </DialogTitle>
                          <DialogDescription>
                           Ao excluir o premio cadastrado não será possivel recuperalo!
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-center gap-3 item-center w-full" >
                        <Button variant="destructive">cancelar</Button>

                        <Button variant="outline" onClick={(e) => {
                            deleteAward(item.Id);
                          }}>excluir</Button>

                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {((item.tagType === "Product" && item.image1) ||
                      (item.tagType === "Money" && item.image)) && (
                      <CardHeader className="min-w-44 w-full">
                        {item.tagType === "Product" ? (
                          <Carousel
                            className="h-full"
                            opts={{ loop: true }}
                            plugins={[
                              Autoplay({ playOnInit: true, delay: 1000 }),
                            ]} // Autoplay com delay
                          >
                            <CarouselContent>
                              {[
                                item.image1,
                                item.image2,
                                item.image3,
                                item.image4,
                              ].map(
                                (image, i) =>
                                  typeof image === "string" &&
                                  image && (
                                    <CarouselItem key={i}>
                                      <Image
                                        src={image}
                                        alt={`Imagem ${i + 1}`}
                                        width={500}
                                        height={200}
                                        className="w-full h-40 object-cover rounded-2xl"
                                      />
                                    </CarouselItem>
                                  )
                              )}
                            </CarouselContent>
                            <CarouselPrevious />
                          </Carousel>
                        ) : (
                          item.tagType === "Money" &&
                          typeof item.image === "string" &&
                          item.image && (
                            <Image
                              src={item.image}
                              alt="Imagem"
                              width={500}
                              height={200}
                              className="w-11/12 h-40 object-cover rounded-2xl"
                            />
                          )
                        )}
                      </CardHeader>
                    )}
                    <CardContent className="w-full p-4 h-full flex flex-col gap-1.5 ">
                      <Typography className="text-2xl font-semibold truncate ">
                        {item.Title}
                      </Typography>

                      {item.tagType === "Money" && (
                        <Typography
                          variant="body2"
                          className="overflow-hidden text-green-700 text-xl "
                        >
                          R$ {item.Value}
                        </Typography>
                      )}

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="overflow-hidden text-ellipsis line-clamp-6 text-wrap"
                      >
                        {item.tagType === "Product" && item.Description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-4">
              <h1>Cadastre um Prêmio</h1>
              <Button
                type="button"
                onClick={() => setCreate(true)}
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
