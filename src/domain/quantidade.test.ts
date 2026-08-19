import { describe, expect, it } from "vitest";
import {
  ErroDeCasasDecimaisExcedidas,
  ErroDeFormatoDeQuantidade,
  ErroDeQuantidadeForaDaFaixa,
} from "./erros";
import { ESCALA_DA_QUANTIDADE, Quantidade } from "./quantidade";

describe("Quantidade", () => {
  it("guarda a menor subunidade como inteiro, na escala decidida", () => {
    expect(ESCALA_DA_QUANTIDADE).toBe(3);
    expect(Quantidade.deTexto("1").emMilesimos()).toBe(1000);
    expect(Quantidade.deTexto("0,5").emMilesimos()).toBe(500);
    expect(Quantidade.deTexto("0,001").emMilesimos()).toBe(1);
  });

  it("aceita virgula e ponto como separador decimal", () => {
    expect(Quantidade.deTexto("1,25").ehIgual(Quantidade.deTexto("1.25"))).toBe(true);
  });

  it("recusa quantidade com mais casas do que a escala admite", () => {
    expect(() => Quantidade.deTexto("1,2345")).toThrow(ErroDeCasasDecimaisExcedidas);
  });

  it("recusa texto que nao e numero", () => {
    for (const invalida of ["", "abc", "1,2,3", "1e3", "R$ 5"]) {
      expect(() => Quantidade.deTexto(invalida)).toThrow(ErroDeFormatoDeQuantidade);
    }
  });

  it("recusa valor que nao cabe no inteiro seguro do JavaScript", () => {
    expect(() => Quantidade.deTexto("99999999999999999")).toThrow(ErroDeQuantidadeForaDaFaixa);
  });

  it("soma e subtrai sem erro de arredondamento em cadeia", () => {
    // Com ponto flutuante, 0,1 somado dez vezes nao da 1.
    let acumulado = Quantidade.zero();
    for (let i = 0; i < 10; i += 1) acumulado = acumulado.somar(Quantidade.deTexto("0,1"));
    expect(acumulado.ehIgual(Quantidade.deTexto("1"))).toBe(true);
    expect(acumulado.paraTexto()).toBe("1");

    const restante = Quantidade.deTexto("0,3")
      .subtrair(Quantidade.deTexto("0,1"))
      .subtrair(Quantidade.deTexto("0,1"))
      .subtrair(Quantidade.deTexto("0,1"));
    expect(restante.ehZero()).toBe(true);
  });

  it("compara duas quantidades", () => {
    const tres = Quantidade.deTexto("3");
    const quatro = Quantidade.deTexto("4");
    expect(tres.ehMenorQue(quatro)).toBe(true);
    expect(quatro.ehMaiorQue(tres)).toBe(true);
    expect(tres.comparar(tres)).toBe(0);
    expect(tres.ehIgual(Quantidade.deTexto("3,000"))).toBe(true);
  });

  it("reconhece positiva, negativa e zero", () => {
    expect(Quantidade.deTexto("0,001").ehPositiva()).toBe(true);
    expect(Quantidade.zero().ehPositiva()).toBe(false);
    expect(Quantidade.zero().ehZero()).toBe(true);
    expect(Quantidade.deTexto("-1").ehNegativa()).toBe(true);
  });

  it("exibe cortando os zeros a direita, com virgula decimal", () => {
    expect(Quantidade.deTexto("10").paraTexto()).toBe("10");
    expect(Quantidade.deTexto("10,000").paraTexto()).toBe("10");
    expect(Quantidade.deTexto("0,5").paraTexto()).toBe("0,5");
    expect(Quantidade.deTexto("1,250").paraTexto()).toBe("1,25");
    expect(Quantidade.deTexto("0,001").paraTexto()).toBe("0,001");
    expect(Quantidade.zero().paraTexto()).toBe("0");
    expect(Quantidade.deTexto("-2,5").paraTexto()).toBe("-2,5");
  });
});
