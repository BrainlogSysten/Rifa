
import { TbBrandGoogleAnalytics } from "react-icons/tb";


interface Props {
    title:string;
    value:string;
}

const CardCount: React.FC<Props> = (props) => {

  return (
    <div className="h-28 w-full relative flex bg-white p-2 max-w-64 justify-between items-center rounded-3xl">
       <div className="w-12 h-12 rounded-2xl bg-gray-700/40 flex justify-center items-center ">
       <TbBrandGoogleAnalytics color="white"size={20} />
       </div>
       <div className=" basis-32 flex flex-col  justify-center items-center">
         <h2 className="text-sm">{props.title}</h2>
         <p className="text-xl font-bold text-stone-600 ">R$ {props.value}</p>
       </div>
       <div className="p-1 relative top-3 bg-green-300 text-green-500 rounded-3xl text-[10px] flex justify-end items-end ">
         +1.29%
       </div>
    </div>
  );
};

export default CardCount;
