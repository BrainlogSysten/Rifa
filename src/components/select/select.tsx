'use client';
import React, {ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineHome } from "react-icons/hi";
import { FaGear } from "react-icons/fa6";
import { LuTicket } from "react-icons/lu";
import { IoIosArrowForward } from "react-icons/io";

type SelectItemProps = {
  title?: string;
  to?: string;
};

export const SelectItem: React.FC<SelectItemProps> = ({ title, to }) => {
  return (
    <div className="hover:text-gray-300">
      <a href={to}>{title}</a>
    </div>
  );
};

type SelectMenuProps = {
  title?: string;
  icon?: React.ReactElement | string;
  children?: ReactNode;
  to?: string;
  reduceMode?: boolean;
  selected?: boolean;
};

export const SelectMenu: React.FC<SelectMenuProps> = (props) => {
  const [showOptions, setShowOptions] = useState(false);
  const { push } = useRouter();;

  const handleClick = () => {
    if (React.Children.count(props.children) > 0) {
      toggleOptions();
    } else if (props.to) {
      push(props.to);
    }
  };

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const renderIcon = () => {
    if (typeof props.icon === "string") {
      return (
        <span className="material-icons-outlined flex justify-center items-center text-sm ms:col-span-1  text-center md:text-center">
          {props.icon}
        </span>
      );
    }
    return props.icon;
  };

  return (
    <div className="">
      <button
        title={`Abrir painel de configuração do ${props.title}`}
        className={`text-slate-500 w-full ${
          showOptions || props.selected ? "bg-gray-900/80 text-white" : ""
        } text-left font-semibold  hover:bg-gray-900/60 justify-center items-center  hover:text-black/50 rounded-md grid p-2 ${
          props.reduceMode ? "grid-cols-1" : "grid-cols-5"
        } items-center gap-x-3 button-container`}
        onClick={handleClick}
      >
        {renderIcon()}
        <p
          className={`text-wrap text-sm grid-flow-col ${
            props.reduceMode ? "" : "col-span-3"
          }`}
        >
          {!props.reduceMode && props.title}
        </p>
        {!props.reduceMode && (
          <div className="">
              <IoIosArrowForward />
          </div>
        )}
      </button>
      {showOptions && (
        <div className="border-l-2 border-green-600 flex justify-start flex-col gap-y-2 pl-3 relative left-5 transition-opacity">
          <div className="transition-opacity flex flex-col justify-center items-center gap-4 px-4">
            {props.children}
          </div>
        </div>
      )}
    </div>
  );
};
