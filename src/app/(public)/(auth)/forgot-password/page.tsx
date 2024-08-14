// import Image from "next/image";
// import { ResetPasswordForm } from "../components/ResetPasswordForm";
// import { ResetPasswordPage, resetPasswordPageSchema } from "@root/schemas/reset-password-page-schema";
// import { redirect } from "next/navigation";

// export default function ForgotPasswordPage({ searchParams }: { searchParams: ResetPasswordPage}) {
//   if (!resetPasswordPageSchema.safeParse(searchParams).success)
//     redirect('/sign-in');

//   return (
//     <div className="w-full h-full md:max-w-2xl p-10 md:pl-20 gap-5 flex flex-col items-stretch animate-in fade-in duration-1000">
//       <Image
//         className="mt-auto mb-5"
//         src="/images/logo/logo--azul.png"
//         alt="Inforlube Authentication Manager"
//         width={236}
//         height={78}
//       />

//       <div className="mb-3">
//         <h1 className="text-blue-700 font-bold text-2xl">Seja bem-vindo ao sistema Auth UI!</h1>
//         <h3 className="text-gray-700 font-medium">
//           Por favor preencha o formulário abaixo para prosseguir com a alteração de senha:
//         </h3>
//       </div>

//       <ResetPasswordForm {...searchParams} />

//       <span className="text-gray-700 font-medium text-sm mt-auto">
//         Powered by LeadSoft® Soluções Web
//       </span>
//     </div>
//   );
// }