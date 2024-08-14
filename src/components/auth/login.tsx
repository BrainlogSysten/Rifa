'use client';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { SyntheticEvent, useCallback, useState } from "react";
import { toast } from 'react-toastify';
import { requestLoginEmployeer } from "@/types/authTypes"; 
import { loginEmployer } from "@/http/api-core-sln"; 
import { useRouter } from "next/navigation";
interface LoginProps {

}

const Login: React.FC<LoginProps> = () => {
  const { push } = useRouter();

  const [formData, setFormData] = useState<requestLoginEmployeer>({
    email: '',
    password: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = useCallback(async (event:any) => {
    event.preventDefault();

    try {
      const result = await loginEmployer({
        email: formData.email,
        password: formData.password,
      });

      console.log(result);

      if (result == 200) {
        push('/home');
      } else {
        toast.error('Usuario não encontrado ');
      }
    } catch (error) {
      console.error(error);
      error == 401 && toast.error('Usuario não encontrado ');
    }
  }, [formData]);


  return (
    <div className="flex items-center min-h-screen px-4 gap-3">
      <div className="mx-auto w-full max-w-sm space-y-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Bem Vindo!</h1>
            <p className="text-gray-500 dark:text-gray-400">Insira o email e senha para o login</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Insira seu Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline" prefetch={false}>
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Insira sua senha"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
