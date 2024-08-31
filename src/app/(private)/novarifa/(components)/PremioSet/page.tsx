import { z } from "zod";
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
import CreateAwardSet from "./create";
import { useState } from "react";

const AwardSet: React.FC = () => {
  const [create, setCreate] = useState<boolean>(false);
  return (
    <div className="w-full h-full ">
      {create == false ? (
        <div className="text-3xl font-semibold flex justify-center items-center flex-col gap-4 w-full h-full ">
          <h1>Cadastre um Premio</h1>
          <Button
            type="submit"
            onClick={() => {
              setCreate(true);
            }}
            className="rounded-xl p-6 font-semi
          bold"
          >
            Cadastrar
          </Button>
        </div>
      ) : (
        <CreateAwardSet />
      )}
    </div>
  );
};

export default AwardSet;
