import type { Movimentacao } from "./movimentacao";
import { Quantidade } from "./quantidade";

/** O saldo e a soma das entradas menos a soma das saidas, nunca um campo
 *  informado ou editavel (invariante **Saldo derivado**). */
export function calcularSaldo(movimentacoes: readonly Movimentacao[]): Quantidade {
  return movimentacoes.reduce(
    (acumulado, movimentacao) => acumulado.somar(movimentacao.efeitoNoSaldo()),
    Quantidade.zero(),
  );
}

/** Saldo igual ou abaixo do estoque minimo recebe aviso na consulta e na
 *  ficha. Sem estoque minimo definido, nao ha aviso (PRD-02, PRD-05). */
export function estaAbaixoDoMinimo(saldo: Quantidade, estoqueMinimo?: Quantidade): boolean {
  if (!estoqueMinimo) return false;
  return !saldo.ehMaiorQue(estoqueMinimo);
}
