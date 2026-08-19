import { TipoDeMovimentacao } from "./tipo-de-movimentacao";

export const MotivoDeEntrada = {
  COMPRA: "COMPRA",
  DOACAO: "DOACAO",
  DEVOLUCAO: "DEVOLUCAO",
} as const;

export type MotivoDeEntrada = (typeof MotivoDeEntrada)[keyof typeof MotivoDeEntrada];

export const MotivoDeSaida = {
  PEDIDO: "PEDIDO",
  CONSUMO_INTERNO: "CONSUMO_INTERNO",
  DESCARTE: "DESCARTE",
  PERDA: "PERDA",
} as const;

export type MotivoDeSaida = (typeof MotivoDeSaida)[keyof typeof MotivoDeSaida];

export type Motivo = MotivoDeEntrada | MotivoDeSaida;

export const MOTIVOS_DE_ENTRADA = Object.values(MotivoDeEntrada);
export const MOTIVOS_DE_SAIDA = Object.values(MotivoDeSaida);

export const ROTULO_DO_MOTIVO: Record<Motivo, string> = {
  COMPRA: "Compra",
  DOACAO: "Doação",
  DEVOLUCAO: "Devolução",
  PEDIDO: "Pedido",
  CONSUMO_INTERNO: "Consumo interno",
  DESCARTE: "Descarte",
  PERDA: "Perda",
};

/** O tipo e escolhido antes dos demais campos justamente para que os motivos
 *  apresentados sejam sempre os corretos (PRD-06). */
export function motivosDoTipo(tipo: TipoDeMovimentacao): readonly Motivo[] {
  return tipo === TipoDeMovimentacao.ENTRADA ? MOTIVOS_DE_ENTRADA : MOTIVOS_DE_SAIDA;
}

export function ehMotivoDoTipo(tipo: TipoDeMovimentacao, motivo: string): motivo is Motivo {
  return (motivosDoTipo(tipo) as readonly string[]).includes(motivo);
}
