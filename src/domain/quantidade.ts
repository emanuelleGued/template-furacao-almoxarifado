import {
  ErroDeCasasDecimaisExcedidas,
  ErroDeFormatoDeQuantidade,
  ErroDeQuantidadeForaDaFaixa,
} from "./erros";

/** Casas decimais da quantidade. Fonte de verdade: a decisao
 *  **Escala da quantidade** de docs/prds/PRD-00-indice.md. */
export const ESCALA_DA_QUANTIDADE = 3;

const FATOR = 10 ** ESCALA_DA_QUANTIDADE;
const FORMATO = /^-?\d+(?:[.,]\d+)?$/;

/** Toda quantidade do sistema: de movimentacao, de estoque minimo e de saldo.
 *  Guarda a menor subunidade como inteiro, nunca ponto flutuante. A aritmetica
 *  acontece aqui dentro, nunca com operadores sobre valores crus
 *  (arquitetura.md). */
export class Quantidade {
  private constructor(private readonly milesimos: number) {}

  static deTexto(entrada: string): Quantidade {
    const texto = entrada.trim();
    if (!FORMATO.test(texto)) throw new ErroDeFormatoDeQuantidade();

    const negativo = texto.startsWith("-");
    const [inteira, decimal = ""] = texto.replace("-", "").replace(",", ".").split(".");
    if (decimal.length > ESCALA_DA_QUANTIDADE)
      throw new ErroDeCasasDecimaisExcedidas(ESCALA_DA_QUANTIDADE);

    const preenchida = decimal.padEnd(ESCALA_DA_QUANTIDADE, "0");
    const total = Number(inteira) * FATOR + Number(preenchida);
    if (!Number.isSafeInteger(total)) throw new ErroDeQuantidadeForaDaFaixa();

    return new Quantidade(negativo ? -total : total);
  }

  /** Reconstroi a partir da menor subunidade ja em inteiro. Usado pela
   *  traducao linha-entidade, na infraestrutura. */
  static deMilesimos(milesimos: number): Quantidade {
    if (!Number.isSafeInteger(milesimos)) throw new ErroDeQuantidadeForaDaFaixa();
    return new Quantidade(milesimos);
  }

  static zero(): Quantidade {
    return new Quantidade(0);
  }

  emMilesimos(): number {
    return this.milesimos;
  }

  somar(outra: Quantidade): Quantidade {
    return Quantidade.deMilesimos(this.milesimos + outra.milesimos);
  }

  subtrair(outra: Quantidade): Quantidade {
    return Quantidade.deMilesimos(this.milesimos - outra.milesimos);
  }

  /** Negativo se esta e menor, zero se iguais, positivo se maior. */
  comparar(outra: Quantidade): number {
    return this.milesimos - outra.milesimos;
  }

  ehIgual(outra: Quantidade): boolean {
    return this.milesimos === outra.milesimos;
  }

  ehMaiorQue(outra: Quantidade): boolean {
    return this.milesimos > outra.milesimos;
  }

  ehMenorQue(outra: Quantidade): boolean {
    return this.milesimos < outra.milesimos;
  }

  ehPositiva(): boolean {
    return this.milesimos > 0;
  }

  ehNegativa(): boolean {
    return this.milesimos < 0;
  }

  ehZero(): boolean {
    return this.milesimos === 0;
  }

  /** Exibicao em portugues, com virgula decimal e sem zeros a direita:
   *  dez resmas viram "10", meio litro vira "0,5". */
  paraTexto(): string {
    const negativo = this.milesimos < 0;
    const absoluto = Math.abs(this.milesimos);
    const inteira = Math.trunc(absoluto / FATOR);
    const decimal = String(absoluto % FATOR)
      .padStart(ESCALA_DA_QUANTIDADE, "0")
      .replace(/0+$/, "");
    const corpo = decimal ? `${inteira},${decimal}` : String(inteira);
    return negativo ? `-${corpo}` : corpo;
  }
}
