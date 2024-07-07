import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import nature from "../../img/nature.jpg";

export default function Login() {
  return (
    <div className="flex items-center min-h-screen px-4 gap-3">
      <div className="mx-auto w-full max-w-sm space-y-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Bem Vindo !</h1>
          <p className="text-gray-500 dark:text-gray-400">Insira o email e senha para o login</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Insira seu Email" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline" prefetch={false}>
                Esqueceu a senha?
              </Link>
            </div>
            <Input id="password" type="password" placeholder="Insira sua senha" required />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </div>
      </div>
      <div className="hidden sm:block sm:relative w-1/2 h-screen ">
        <Image src={nature} alt="Nature" layout="fill" objectFit="cover" />
      </div>
    </div>
  )
}
