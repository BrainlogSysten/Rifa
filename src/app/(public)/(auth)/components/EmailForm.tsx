// 'use client';

// import Button from '@components/Button';
// import { TextInput } from '@components/TextInput';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { verifySystemAccess } from '@root/main/registry';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import { useToast } from '@/components/ui/use-toast';
// import { SignInEmail, signInEmailSchema } from '@root/schemas/sign-in-email-schema';
// import { reCAPTCHA } from '@root/data/reCAPTCHA/recaptcha';
// import { useEffect } from 'react';

// const recaptchaInstance = new reCAPTCHA(
//   process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
//   'login'
// );

// export function EmailForm() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { toast } = useToast();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting, dirtyFields },
//   } = useForm<SignInEmail>({ resolver: zodResolver(signInEmailSchema) });

//   const onSubmit = async ({ email }: SignInEmail) => {
//     try {
//       const recaptcha = await recaptchaInstance.getToken();

//       if (!recaptcha) throw new Error('Ocorreu um erro ao realizar o login');

//       const isSystem = await verifySystemAccess.execute({ email, recaptcha });
//       if (isSystem) router.push(pathname + `?email-sent=${email}`);
//       else router.push('sign-in/password' + `?email=${email}`);
//     } catch (error: any) {
//       toast({
//         title: error.message,
//         variant: 'destructive',
//       });
//     }
//   };

//   useEffect(() => {
//     let recaptchaScript = null as HTMLScriptElement | null;

    

//     if (dirtyFields.email) recaptchaScript = recaptchaInstance.loadReCaptcha();

//     return () => recaptchaScript?.remove();
//   },[dirtyFields.email]);

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} noValidate>
//       <TextInput {...register('email')} label="Seu e-mail" required error={errors.email?.message} />
//       <Button type="submit" color="blue" className="w-full mt-5" isLoading={isSubmitting} >
//         Login
//       </Button>
//     </form>
//   );
// }
