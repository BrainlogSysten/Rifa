"use client";
import Image from "next/image";
import nature from "../../../img/nature.jpg";
import { PropsWithChildren } from "react";
import { PagamentoChart } from "@/components/graficsAnalitics/paymentGraphic";
import CardCount from "@/components/graficsAnalitics/cardCount";
import { ArrowUpRight, CalendarIcon, Icon, Search } from "lucide-react";
import { PiMoneyWavy } from "react-icons/pi";
import { GoPeople } from "react-icons/go";
import { IoTicketOutline } from "react-icons/io5";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { SalesGraphic } from "@/components/graficsAnalitics/salesgrafic";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Home: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col gap-3 ">
      <h1 className="font-semibold text-2xl ">Home</h1>
      <section className=" flex gap-10  ">
        <Card>
          <CardHeader>
            <CardTitle>Rendimento Total</CardTitle>

            <PiMoneyWavy style={{ margin: 0 }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">$ 45.231,89</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              +20,1% em relação ao mês passado{" "}
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total de acessos</CardTitle>
            <GoPeople style={{ margin: 0 }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">$ 33,231,89</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              +20,1% em relação ao mês passado{" "}
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total de rifas</CardTitle>
            <IoTicketOutline style={{ margin: 0 }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">$ 11.231,89</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              +20,1% em relação ao mês passado{" "}
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Select>
          <SelectTrigger className="w-[180px] bg-white rounded shadow-lg">
            <SelectValue placeholder="Campanhas" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>Campanhas</SelectLabel>
              <SelectItem value="apple">campanha 1</SelectItem>
              <SelectItem value="banana">campanha 2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>
      <div className="flex w-full gap-5 justify-between items-start">
        <div className="basis-8/12">
          <SalesGraphic />
        </div>
        <div className="w-4/12">
          <PagamentoChart />
        </div>
      </div>

      <div className="w-full bg-white rounded-2xl p-4 ">
        <div className="w-full flex justify-between items-center">
          <h1>Clientes</h1>
          <div className="flex items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full appearance-none bg-background pl-8 shadow-none "
              />
            </div>
            <div className="flex items-center gap-10">
              <Popover>
                <PopoverTrigger asChild>
                  <CalendarIcon className="ml-auto h-5 w-5 opacity-50 cursor-pointer hover:-translate-y-1 hover:scale-110 duration-300" />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    // selected={field.value}
                    // onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">id</TableHead>
              <TableHead className="hidden sm:table-cell">Nome</TableHead>
              <TableHead className="hidden sm:table-cell">Data</TableHead>
              <TableHead className="hidden md:table-cell">Rifa</TableHead>
              <TableHead className="text-right">Valor Pago</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium">Liam Johnson</div>
                <div className="">liam@example.com</div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">Sale</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Fulfilled
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-06-23</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Olivia Smith</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  olivia@example.com
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">Refund</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="outline">
                  Declined
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-06-24</TableCell>
              <TableCell className="text-right">$150.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Noah Williams</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  noah@example.com
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                Subscription
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Fulfilled
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-06-25</TableCell>
              <TableCell className="text-right">$350.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Home;
