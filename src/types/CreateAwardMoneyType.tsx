import { Url } from "next/dist/shared/lib/router/router";

export interface CreateAwardMoneyType {
    Id: string;
    Title: string;
    Value: string;
    image?: File | null | Url | string  ;
    tagType?: "Money",
  }