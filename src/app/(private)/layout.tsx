import { PropsWithChildren } from "react";
import SideMenu from "@/components/layoutDash/sideMenu";
import { FaRegBell } from "react-icons/fa";

export default async function AuthLayout({ children }: PropsWithChildren) {

  return (
    <div className="h-screen w-full flex">
      <SideMenu/>
      <div className="flex-col h-screen w-full overflow-x-auto p-2 bg-zinc-400/10 ">
          <FaRegBell className="w-6 h-6 absolute right-7 top-2" />
          {children}
      </div>
    </div>
  );
}