"use client";
import Image from "next/image";
import nature from "../../../img/nature.jpg";
import { PropsWithChildren } from "react";
import { PagamentoChart } from "@/components/graficsAnalitics/paymentGraphic";
import CardCount from "@/components/graficsAnalitics/cardCount";
import { Search, Plus } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Campaign: React.FC = () => {
  const { push } = useRouter();
  return (
    <div className="h-full w-full flex flex-col gap-3 relative ">
      <h1 className="font-semibold text-2xl ">Capanhas</h1>
      <div className="flex items-center gap-9 w-full justify-center ">
        <div className="relative w-9/12">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full appearance-none bg-background p-5 pl-8 rounded-xl shadow-xl  "
          />
        </div>
        <Select>
          <SelectTrigger className="w-[180px] bg-white  shadow-lg p-5 rounded-xl">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectItem value="apple">Ativos</SelectItem>
              <SelectItem value="banana">Intivos</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full flex flex-wrap gap-9 justify-around items-center">
        <Card className="max-w-72 cursor-pointer">
          <CardHeader>
            <CardTitle className="rounded-lg">
              <img
                src="https://www.pixel4k.com/wp-content/uploads/2020/02/darth-vader_1582151996-1536x864.jpg.webp"
                alt="darth vader"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <p className="font-semibold">Titulo da rifa</p>
            <Badge className="rounded-xl bg-green-600">Ativo</Badge>
          </CardContent>
          <CardFooter className="max-h-40">
            <p className="text-lg truncate-multiline">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the s standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not
              only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised
              in the 1960s with the release of Letraset sheets containing Lorem
              Ipsum passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </CardFooter>
        </Card>
        <Card className="max-w-72 cursor-pointer">
          <CardHeader>
            <CardTitle className="rounded-lg">
              <img
                src="https://www.pixel4k.com/wp-content/uploads/2020/02/darth-vader_1582151996-1536x864.jpg.webp"
                alt="darth vader"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <p className="font-semibold">Titulo da rifa</p>
            <Badge className="rounded-xl bg-green-600">Ativo</Badge>
          </CardContent>
          <CardFooter className="max-h-40">
            <p className="text-lg truncate-multiline">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the s standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not
              only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised
              in the 1960s with the release of Letraset sheets containing Lorem
              Ipsum passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </CardFooter>
        </Card>{" "}
        <Card className="max-w-72 cursor-pointer">
          <CardHeader>
            <CardTitle className="rounded-lg">
              <img
                src="https://www.pixel4k.com/wp-content/uploads/2020/02/darth-vader_1582151996-1536x864.jpg.webp"
                alt="darth vader"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <p className="font-semibold">Titulo da rifa</p>
            <Badge className="rounded-xl bg-green-600">Ativo</Badge>
          </CardContent>
          <CardFooter className="max-h-40">
            <p className="text-lg truncate-multiline">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the s standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not
              only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised
              in the 1960s with the release of Letraset sheets containing Lorem
              Ipsum passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </CardFooter>
        </Card>{" "}
        <Card className="max-w-72 cursor-pointer">
          <CardHeader>
            <CardTitle className="rounded-lg">
              <img
                src="https://www.pixel4k.com/wp-content/uploads/2020/02/darth-vader_1582151996-1536x864.jpg.webp"
                alt="darth vader"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <p className="font-semibold">Titulo da rifa</p>
            <Badge className="rounded-xl bg-green-600">Ativo</Badge>
          </CardContent>
          <CardFooter className="max-h-40">
            <p className="text-lg truncate-multiline">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the s standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not
              only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised
              in the 1960s with the release of Letraset sheets containing Lorem
              Ipsum passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </CardFooter>
        </Card>{" "}
        <Card className="max-w-72 cursor-pointer">
          <CardHeader>
            <CardTitle className="rounded-lg">
              <img
                src="https://www.pixel4k.com/wp-content/uploads/2020/02/darth-vader_1582151996-1536x864.jpg.webp"
                alt="darth vader"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <p className="font-semibold">Titulo da rifa</p>
            <Badge className="rounded-xl bg-green-600">Ativo</Badge>
          </CardContent>
          <CardFooter className="max-h-40">
            <p className="text-lg truncate-multiline">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the s standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not
              only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised
              in the 1960s with the release of Letraset sheets containing Lorem
              Ipsum passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </CardFooter>
        </Card>
        <Card className="max-w-72 cursor-pointer">
          <CardHeader>
            <CardTitle className="rounded-lg">
              <img
                src="https://www.pixel4k.com/wp-content/uploads/2020/02/darth-vader_1582151996-1536x864.jpg.webp"
                alt="darth vader"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <p className="font-semibold">Titulo da rifa</p>
            <Badge className="rounded-xl bg-green-600">Ativo</Badge>
          </CardContent>
          <CardFooter className="max-h-40">
            <p className="text-lg truncate-multiline">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the s standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not
              only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised
              in the 1960s with the release of Letraset sheets containing Lorem
              Ipsum passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </CardFooter>
        </Card>
      </div>
      <div className="m-4 mb-32 h-11">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" className="" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
            onClick={()=>{push('/novarifa');}}
              variant="outline"
              className="fixed animate-bounce right-6 bottom-6 rounded-full w-14 h-14 border-2 border-green-600"
            >
              <Plus size={40} color="green" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-black rounded-xl p-1 font-semibold ">
            <p>Clique aqui apara criar uma nova campanha</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Campaign;
