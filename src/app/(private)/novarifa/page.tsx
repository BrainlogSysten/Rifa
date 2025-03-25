"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Ticket } from "lucide-react";
import ConfigSet from "./(components)/ConfigSet/page";
import AwardSet from "./(components)/PremioSet/page";
import ArrecadarSet from "./(components)/ArrecadarSet/page";
import { CreateAwardMoneyType } from "@/types/CreateAwardMoneyType";
import { CreateAwardtype } from "@/types/CreateAwardtype";

const Campaign: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<"config" | "award" >("config");
  const [awardItems, setAwardItems] = useState<
    (CreateAwardMoneyType | CreateAwardtype)[]
  >([])
  

  const handleConfigData = (formData: FormData) => {
    const dataObject = Object.fromEntries(formData.entries());
  };

  return (
    <div className="h-full w-full flex flex-col gap-3 relative">
      <h1 className="font-semibold text-2xl flex gap-2 items-center mb-3 text-slate-500">
        <Ticket /> Nova Campanha
      </h1>
      <div className="bg-white rounded-xl p-4 max-h-[670px]  h-full relative text-slate-500">
        <div className="flex flex-col gap-4 mb-3">
          <div className="flex h-4 font-semibold  items-center gap-5 text-sm w-full px-4 justify-around">
            <button
              className={`text-2xl ${activeComponent === "config" && "text-cyan-600"}`}
              onClick={() => setActiveComponent("config")}
            >
              Configuração
            </button>
            <Separator orientation="vertical" />
            <button
              className={`text-2xl ${activeComponent === "award" && "text-cyan-600"}`}
              onClick={() => setActiveComponent("award")}
            >
              Premios
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 items-center h-[94%] w-full overflow-hidden">
          {activeComponent === "config" && <ConfigSet ExistAward={awardItems.length > 0} sendData={(data)=>{handleConfigData(data),setActiveComponent("award")}} />}
          {activeComponent === "award" && <AwardSet sendData={(data)=> {setAwardItems(data)} }  />}
        </div>
      </div>
    </div>
  );
};

export default Campaign;
