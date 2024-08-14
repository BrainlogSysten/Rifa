import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import nature from "../../../img/nature.jpg";
import { PropsWithChildren } from "react";

export default async function AuthLayout({ children }: PropsWithChildren) {

  return (
    <div className="h-full w-full flex">
      <div className="mx-auto w-full max-w-sm space-y-4">{children}</div>
      <div className="hidden sm:block sm:relative w-1/2 h-screen">
        <Image src={nature} alt="Nature" layout="fill" objectFit="cover" />
      </div>
    </div>
  );
}