/** Categoria do material (minimundo, *A categoria do material*). O membro e
 *  identico ao valor persistido: sem acento, sem camada de traducao. */
export const Categoria = {
  PERECIVEL: "PERECIVEL",
  COMPONENTE_DE_TI: "COMPONENTE_DE_TI",
  USO_COMUM: "USO_COMUM",
  LIMPEZA: "LIMPEZA",
  FERRAMENTA: "FERRAMENTA",
} as const;

export type Categoria = (typeof Categoria)[keyof typeof Categoria];

export const CATEGORIAS = Object.values(Categoria);

/** Grafia correta para exibicao ao usuario. */
export const ROTULO_DA_CATEGORIA: Record<Categoria, string> = {
  PERECIVEL: "Perecível",
  COMPONENTE_DE_TI: "Componente de TI",
  USO_COMUM: "Uso comum",
  LIMPEZA: "Limpeza",
  FERRAMENTA: "Ferramenta",
};
