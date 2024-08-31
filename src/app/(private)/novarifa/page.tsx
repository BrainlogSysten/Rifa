"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Ticket } from "lucide-react";
import ConfigSet from "./(components)/ConfigSet/page";
import AwardSet from "./(components)/PremioSet/page";

const Campaign: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<"config" | "award" | "arrecadacao" | "apresentacao">("config");

  const handleConfigData = (formData: FormData) => {
    const dataObject = Object.fromEntries(formData.entries());
    console.log(dataObject,"aquiiiiii");  // Manipule ou use os dados conforme necessário
  };

  return (
    <div className="h-full w-full flex flex-col gap-3 relative">
      <h1 className="font-semibold text-2xl flex gap-2 items-center mb-3">
        <Ticket /> Nova Campanha
      </h1>
      <div className="bg-white rounded-xl p-4 h-full relative">
        <div className="flex flex-col gap-4 mb-3">
          <div className="flex h-4 items-center gap-5 text-sm justify-between px-4">
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
            <Separator orientation="vertical" />
            <button
              className={`text-2xl ${activeComponent === "arrecadacao" && "text-cyan-600"}`}
              onClick={() => setActiveComponent("arrecadacao")}
            >
              Arrecadação
            </button>
            <Separator orientation="vertical" />
            <button
              className={`text-2xl ${activeComponent === "apresentacao" && "text-cyan-600"}`}
              onClick={() => setActiveComponent("apresentacao")}
            >
              Apresentação
            </button>
          </div>
          <Separator />
        </div>
        <div className="flex flex-col gap-3 items-center h-5/6 w-full overflow-hidden">
          {activeComponent === "config" && <ConfigSet sendData={(data)=>{handleConfigData(data),setActiveComponent("award")}} />}
          {activeComponent === "award" && <AwardSet />}
          {/* Adicione aqui os outros componentes conforme necessário */}
        </div>
      </div>
    </div>
  );
};

export default Campaign;
