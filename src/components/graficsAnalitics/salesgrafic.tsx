"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Janeiro", Usuarios: 186, Rifas: 80 },
  { month: "Fevereiro", Usuarios: 305, Rifas: 200 },
  { month: "Março", Usuarios: 237, Rifas: 120 },
  { month: "Abril", Usuarios: 73, Rifas: 190 },
  { month: "Maio", Usuarios: 209, Rifas: 130 },
  { month: "Junho", Usuarios: 214, Rifas: 140 },
];

const chartConfig = {
  Usuarios: {
    label: "Usuarios",
    color: "#30C2F0",
  },
  Rifas: {
    label: "Rifas",
    color: "#368BF5",
  },
} satisfies ChartConfig;

export function SalesGraphic() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas: </CardTitle>
        <Popover>
          <PopoverTrigger asChild >
            <Button
              variant={"outline"}
              className={cn("pl-3 text-left font-normal")}
            >
              {"January - June 2024"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
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
      </CardHeader>
      <CardContent>
        <div >
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} barSize={33} >
            <CartesianGrid  vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={4}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="Usuarios" fill="var(--color-Usuarios)" radius={4} />
            <Bar dataKey="Rifas" fill="var(--color-Rifas)" radius={4} />
          </BarChart>
        </ChartContainer>
        </div>
      
      </CardContent>
    </Card>
  );
}
