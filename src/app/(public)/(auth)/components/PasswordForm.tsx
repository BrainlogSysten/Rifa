// 'use client'

// import Button from "@components/Button";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useToast } from "@/components/ui/use-toast";
// import { PasswordInput } from "@components/PasswordInput";
// import { SignInPassword, signInPasswordSchema } from "@root/schemas/sign-in-password-schema";
// import { userSignIn } from "@root/main/registry";
// import { useRouter } from "next/navigation";

// export function PasswordForm({ email }: { email: string; }) {
//   const { toast } = useToast();
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<SignInPassword>({ resolver: zodResolver(signInPasswordSchema) });

//   const onSubmit = ({ password }: SignInPassword) => {
//     userSignIn
//       .execute({ email, password })
//       .then((authCode) => router.push('/?authCode=' + authCode))
//       .catch((error: any) =>
//         toast({
//           title: error.message,
//           variant: 'destructive',
//         })
//       );
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} noValidate>
//       <PasswordInput {...register("password")} label="Senha" required error={errors.password?.message} />
//       <Button type="submit" color="blue" className="w-full mt-5" isLoading={isSubmitting}>
//         Login
//       </Button>
//     </form>
//   );
// }
