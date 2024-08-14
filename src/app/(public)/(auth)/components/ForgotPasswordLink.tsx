// 'use client';

// import { useToast } from '@/components/ui/use-toast';
// import Button from '@components/Button';
// import { forgotPassword } from '@root/main/registry';

// type Props = {
//   email: string;
//   onClick: () => void;
// };

// export function ForgotPasswordLink({ email, onClick }: Props) {
//   const { toast } = useToast();

//   const onSubmitForgotPassword = () => {
//     forgotPassword
//       .execute(email)
//       .then(onClick)
//       .catch((error: any) =>
//         toast({
//           title: error.message,
//           variant: 'destructive',
//         })
//       );
//   };

//   return (
//     <p className="text-sm text-gray-700 font-medium self-center text-center">
//       Esqueceu a senha?{' '}
//       <button onClick={onSubmitForgotPassword} className="font-bold text-blue-700 hover:underline">
//         Clique aqui
//       </button>
//     </p>
//   );
// }
