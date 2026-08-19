"use client";

import { useEffect, useState } from "react";

const SEGUNDOS_VISIVEL = 5;

/** A confirmacao some sozinha, sem exigir acao do usuario (spec
 *  casca-da-aplicacao, "Retorno de acao concluida"). Um temporizador so existe
 *  no navegador, por isso este e o componente de cliente mais interno possivel:
 *  a tela que o usa continua sendo componente de servidor. */
export function AvisoDeAcao({ mensagem }: { mensagem: string }) {
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    setVisivel(true);
    const temporizador = setTimeout(() => setVisivel(false), SEGUNDOS_VISIVEL * 1000);
    return () => clearTimeout(temporizador);
  }, [mensagem]);

  if (!visivel) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-marca text-primary text-secundario fixed top-20 right-8 z-20 px-[18px] py-3 font-bold"
    >
      {mensagem}
    </div>
  );
}
