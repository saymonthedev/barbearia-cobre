import Link from "next/link";
import { Seal } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-6 text-center">
      <div>
        <Seal className="mx-auto size-16 text-bone" />
        <p className="sign mt-8 text-sm text-copper-300">Erro 404</p>
        <h1 className="display mt-4 text-[clamp(3rem,9vw,6rem)]">
          Essa cadeira <span className="display-italic">não existe.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-bone-muted">A página que você procurou saiu antes do corte. Volte para o salão.</p>
        <Link href="/" className="btn btn-copper mt-10">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
