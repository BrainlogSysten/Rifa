
'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SelectMenu } from "../select/select";
import { LuTicket } from "react-icons/lu";
import { HiOutlineHome } from "react-icons/hi";
import { FaGear } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";

const SideMenu: React.FC = () => {
  const { push } = useRouter();
  const onLogout = () => {
    
    localStorage.removeItem('userToken');
    
    push('/sign-in');
  };

  return (
    <div className="h-full w-full flex flex-col max-w-56 gap-10 p-2 justify-between">
      <div className="h-full w-full flex flex-col max-w-56 gap-10 ">
        <h1>logo</h1>
        <SelectMenu
          icon={<HiOutlineHome />}
          title="home"
          to="/home"
          selected={true}
        ></SelectMenu>
        <SelectMenu
          icon={<LuTicket />}
          title="Campanhas"
          to="/campanha"
          selected={true}
        ></SelectMenu>
        <SelectMenu
          icon={<FaGear />}
          title="Configurações"
          to="/configuracoes"
          selected={true}
        ></SelectMenu>
      </div>

      <button
        className={`text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition-all  w-full text-left font-semibold  justify-center  rounded-md p-2 items-center gap-x-3 button-container flex`}
        onClick={onLogout}
      >
        <TbLogout2 />
        Sair
      </button>
    </div>
  );
};

export default SideMenu;
