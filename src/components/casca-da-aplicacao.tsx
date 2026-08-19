import Image from "next/image";
import Link from "next/link";
import { AvisoDeAcao } from "@/components/aviso-de-acao";
import marca from "@/marca/ideia-horizontal.png";

const AREAS = [
  { chave: "materiais", rotulo: "Materiais", rota: "/materiais" },
  { chave: "usuarios", rotulo: "Cadastrar usuário", rota: "/usuarios/novo" },
] as const;

export type AreaDaCasca = (typeof AREAS)[number]["chave"];

type Props = {
  /** Area corrente, indicada na navegacao. Vem da propria tela, e nao do
   *  caminho: um layout do App Router nao conhece a rota que ele envolve, e
   *  ler o caminho exigiria um componente de cliente sem uma das razoes que
   *  conventions.md admite para `"use client"`. */
  area: AreaDaCasca;
  usuarioNome?: string;
  /** Confirmacao de uma acao concluida na tela anterior. */
  aviso?: string;
  children: React.ReactNode;
};

export function CascaDaAplicacao({ area, usuarioNome, aviso, children }: Props) {
  return (
    <div className="min-h-screen">
      <header className="border-border bg-background sticky top-0 z-10 flex h-16 items-center gap-8 border-b px-8">
        <Image src={marca} alt="IDE.IA" height={28} priority className="h-7 w-auto" />
        <div className="bg-border h-[26px] w-px" />
        <span className="text-apoio text-muted-foreground font-bold tracking-[0.08em] uppercase">
          Almoxarifado
        </span>

        <nav className="ml-6 flex gap-2">
          {AREAS.map((entrada) => {
            const corrente = entrada.chave === area;
            return (
              <Link
                key={entrada.chave}
                href={entrada.rota}
                aria-current={corrente ? "page" : undefined}
                className={
                  corrente
                    ? "text-secundario text-foreground hover:text-marca-forte px-3 py-2 font-bold"
                    : "text-secundario text-muted-foreground hover:text-marca-forte px-3 py-2 font-semibold"
                }
              >
                {entrada.rotulo}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {usuarioNome ? (
            <span className="text-apoio text-muted-foreground">{usuarioNome}</span>
          ) : null}
          <button
            type="button"
            className="border-border text-apoio text-foreground hover:border-primary cursor-pointer border px-3.5 py-2 font-bold"
          >
            Sair
          </button>
        </div>
      </header>

      {aviso ? <AvisoDeAcao mensagem={aviso} /> : null}

      <main className="mx-auto max-w-[1180px] px-8 pt-9 pb-20">{children}</main>
    </div>
  );
}
