"use client";

import { cn } from "@/lib/utils";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
import { CalendarIcon } from "@radix-ui/react-icons";
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
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";

const chartData = [
  { browser: "pix", pagamentos: 275, fill: "var(--color-pix)" },
  { browser: "Boleto", pagamentos: 200, fill: "var(--color-Boleto)" },
  { browser: "Cartão", pagamentos: 187, fill: "var(--color-Cartão)" },
];

const chartConfig = {
  pagamentos : {
    label: "pagamentos :",
  },
  pix: {
    label: "pix",
    color: "hsl(var(--chart-1))",
  },
  Boleto: {
    label: "Boleto",
    color: "hsl(var(--chart-2))",
  },
  Cartão: {
    label: "Cartão",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function PagamentoChart() {

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Recebimentos</CardTitle>
        <CardDescription>
          <div className=" flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <CalendarIcon className="ml-auto h-7 w-7 opacity-50 cursor-pointer hover:-translate-y-1 hover:scale-110 duration-300" />
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
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="pagamentos" hideLabel />}
            />
            <Pie data={chartData} dataKey="pagamentos">
              <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
         Aumento de 5% comparado ao ultimo mês <TrendingUp className="h-4 w-4 " color="green" />
        </div>
        <div className="leading-none text-muted-foreground">
          Apresentação dos ultimos 6 meses
        </div>
      </CardFooter>
    </Card>
  );
}
