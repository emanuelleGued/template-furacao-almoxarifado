import {
  ErroDeJustificativaObrigatoria,
  ErroDeQuantidadeNaoPositiva,
  ErroDeRetiradoPorObrigatorio,
} from "./erros";
import { ehMotivoDoTipo, type Motivo } from "./motivo";
import { Quantidade } from "./quantidade";
import { TipoDeMovimentacao } from "./tipo-de-movimentacao";

export type DadosDaMovimentacao = {
  readonly id: string;
  readonly materialCodigo: string;
  readonly tipo: TipoDeMovimentacao;
  readonly quantidade: Quantidade;
  readonly motivo: Motivo;
  readonly responsavelId: string;
  readonly responsavelNome: string;
  readonly registradaEm: Date;
  readonly retiradoPor?: string;
  /** Preenchido quando esta movimentacao estorna outra. */
  readonly estornoDe?: string;
  readonly justificativa?: string;
};

/** Movimentacao gravada nao e editada nem apagada; a correcao e um estorno
 *  vinculado (invariante **Movimentacao imutavel**). Por isso a entidade nao
 *  expoe nenhum metodo de alteracao. */
export class Movimentacao {
  readonly id: string;
  readonly materialCodigo: string;
  readonly tipo: TipoDeMovimentacao;
  readonly quantidade: Quantidade;
  readonly motivo: Motivo;
  readonly responsavelId: string;
  readonly responsavelNome: string;
  readonly registradaEm: Date;
  readonly retiradoPor?: string;
  readonly estornoDe?: string;
  readonly justificativa?: string;

  constructor(dados: DadosDaMovimentacao) {
    if (!dados.quantidade.ehPositiva()) throw new ErroDeQuantidadeNaoPositiva();

    if (!ehMotivoDoTipo(dados.tipo, dados.motivo)) {
      throw new Error(`Motivo ${dados.motivo} nao pertence ao tipo ${dados.tipo}.`);
    }

    if (dados.tipo === TipoDeMovimentacao.SAIDA && !dados.retiradoPor?.trim()) {
      throw new ErroDeRetiradoPorObrigatorio();
    }

    if (dados.estornoDe && !dados.justificativa?.trim()) {
      throw new ErroDeJustificativaObrigatoria();
    }

    this.id = dados.id;
    this.materialCodigo = dados.materialCodigo;
    this.tipo = dados.tipo;
    this.quantidade = dados.quantidade;
    this.motivo = dados.motivo;
    this.responsavelId = dados.responsavelId;
    this.responsavelNome = dados.responsavelNome;
    this.registradaEm = dados.registradaEm;
    this.retiradoPor = dados.retiradoPor;
    this.estornoDe = dados.estornoDe;
    this.justificativa = dados.justificativa;
  }

  ehEntrada(): boolean {
    return this.tipo === TipoDeMovimentacao.ENTRADA;
  }

  ehEstorno(): boolean {
    return this.estornoDe !== undefined;
  }

  /** O quanto esta movimentacao muda o saldo: positivo na entrada, negativo
   *  na saida. */
  efeitoNoSaldo(): Quantidade {
    return this.ehEntrada() ? this.quantidade : Quantidade.zero().subtrair(this.quantidade);
  }
}
