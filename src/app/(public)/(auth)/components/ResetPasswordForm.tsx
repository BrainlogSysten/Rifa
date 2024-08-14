// 'use client';

// import Button from '@components/Button';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useToast } from '@/components/ui/use-toast';
// import { PasswordInput } from '@components/PasswordInput';
// import { useRouter } from 'next/navigation';
// import { ResetPassword, resetPasswordSchema } from '@root/schemas/reset-password-schema';
// import { ResetPasswordPage } from '@root/schemas/reset-password-page-schema';
// import { changePasswordWithCode } from '@root/main/registry';

// export function ResetPasswordForm(props: ResetPasswordPage) {
//   const { toast } = useToast();
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<ResetPassword>({ resolver: zodResolver(resetPasswordSchema) });

//   const onSubmit = ({ password }: ResetPassword) => {
//     changePasswordWithCode.execute({ email: props.email, code: props['recover-code'], password })
//     .then(() => router.push('/sign-in'))
//     .catch((error: any) =>
//       toast({
//         title: error.message,
//         variant: 'destructive',
//       })
//     );
//   };

//   return (
//     <form className='space-y-3' onSubmit={handleSubmit(onSubmit)} noValidate>
//       <PasswordInput
//         {...register('password')}
//         label="Senha"
//         required
//         error={errors.password?.message}
//       />
//       <PasswordInput
//         {...register('passwordConfirmation')}
//         label="Confirmação de senha"
//         required
//         error={errors.passwordConfirmation?.message}
//       />
//       <Button type="submit" color="blue" className="w-full mt-5" isLoading={isSubmitting}>
//         Alterar senha
//       </Button>
//     </form>
//   );
// }
