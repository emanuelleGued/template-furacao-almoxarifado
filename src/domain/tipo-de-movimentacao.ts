/** Tipo da movimentacao. E ele que determina se o saldo aumenta ou diminui;
 *  a quantidade e sempre positiva (minimundo, *As movimentacoes e o saldo*). */
export const TipoDeMovimentacao = {
  ENTRADA: "ENTRADA",
  SAIDA: "SAIDA",
} as const;

export type TipoDeMovimentacao = (typeof TipoDeMovimentacao)[keyof typeof TipoDeMovimentacao];

export const ROTULO_DO_TIPO: Record<TipoDeMovimentacao, string> = {
  ENTRADA: "Entrada",
  SAIDA: "Saída",
};
