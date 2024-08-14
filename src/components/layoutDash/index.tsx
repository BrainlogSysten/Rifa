import { PropsWithChildren } from "react";
import SideMenu from "./sideMenu";

export function LayoutDash({ children }: PropsWithChildren) {

  return (
    <div className="flex w-full h-full">
      <SideMenu/>
      <div className="flex-col h-full w-full overflow-x-auto">
        <div className="flex w-full overflow-y-auto" >
          {children}
        </div>
      </div>
    </div>
  );
}
