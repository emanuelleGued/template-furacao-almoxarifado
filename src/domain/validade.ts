/** Situacao de validade de um perecivel. A data atual entra como valor
 *  explicito: nenhum calculo do dominio le o relogio do sistema
 *  (conventions.md, Testes). */
export type SituacaoDeValidade = {
  readonly vencido: boolean;
  readonly texto: string;
};

const FORMATO_DE_DATA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

/** Data de validade e data de fabricacao sao datas de calendario, sem hora.
 *  Comparar em UTC evita que o fuso do servidor mova o dia. */
function emDiaUtc(data: Date): number {
  return Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate());
}

export function formatarData(data: Date): string {
  return FORMATO_DE_DATA.format(data);
}

/** Vencido quando a validade e anterior a data atual (invariante **Perecivel
 *  com validade**). Vencer hoje ainda nao e estar vencido. */
export function estaVencido(dataDeValidade: Date, dataAtual: Date): boolean {
  return emDiaUtc(dataDeValidade) < emDiaUtc(dataAtual);
}

export function situacaoDeValidade(dataDeValidade: Date, dataAtual: Date): SituacaoDeValidade {
  const vencido = estaVencido(dataDeValidade, dataAtual);
  const data = formatarData(dataDeValidade);
  return { vencido, texto: vencido ? `Vencido em ${data}` : `Válido até ${data}` };
}
