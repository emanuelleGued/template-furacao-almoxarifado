/** Unidade de medida do material (minimundo, *O que e um material*). */
export const UnidadeDeMedida = {
  UNIDADE: "UNIDADE",
  CAIXA: "CAIXA",
  PACOTE: "PACOTE",
  RESMA: "RESMA",
  METRO: "METRO",
  LITRO: "LITRO",
} as const;

export type UnidadeDeMedida = (typeof UnidadeDeMedida)[keyof typeof UnidadeDeMedida];

export const UNIDADES_DE_MEDIDA = Object.values(UnidadeDeMedida);

export const ROTULO_DA_UNIDADE: Record<UnidadeDeMedida, string> = {
  UNIDADE: "unidade",
  CAIXA: "caixa",
  PACOTE: "pacote",
  RESMA: "resma",
  METRO: "metro",
  LITRO: "litro",
};

const PLURAL_DA_UNIDADE: Record<UnidadeDeMedida, string> = {
  UNIDADE: "unidades",
  CAIXA: "caixas",
  PACOTE: "pacotes",
  RESMA: "resmas",
  METRO: "metros",
  LITRO: "litros",
};

/** "3 resmas", "1 resma". O saldo e exibido sempre na unidade do material. */
export function rotularUnidade(unidade: UnidadeDeMedida, quantidadeExibida: string): string {
  return quantidadeExibida === "1" ? ROTULO_DA_UNIDADE[unidade] : PLURAL_DA_UNIDADE[unidade];
}
