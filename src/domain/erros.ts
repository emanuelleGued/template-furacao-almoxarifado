/** Codigo estavel de um erro de dominio, no formato CONTEXTO.CAUSA
 *  (conventions.md, "Mensagens de erro"). */
export type CodigoDeErro =
  | "QUANTIDADE.FORMATO_INVALIDO"
  | "QUANTIDADE.CASAS_DECIMAIS_EXCEDIDAS"
  | "QUANTIDADE.FORA_DA_FAIXA"
  | "MATERIAL.NOME_DUPLICADO"
  | "MATERIAL.UNIDADE_IMUTAVEL"
  | "MATERIAL.ESTOQUE_MINIMO_NEGATIVO"
  | "MATERIAL.VALIDADE_OBRIGATORIA"
  | "MATERIAL.POSSUI_MOVIMENTACOES"
  | "MOVIMENTACAO.QUANTIDADE_NAO_POSITIVA"
  | "MOVIMENTACAO.SALDO_INSUFICIENTE"
  | "MOVIMENTACAO.RETIRADO_POR_OBRIGATORIO"
  | "MOVIMENTACAO.JUSTIFICATIVA_OBRIGATORIA"
  | "USUARIO.EMAIL_DUPLICADO"
  | "USUARIO.INATIVO"
  | "USUARIO.CREDENCIAL_INVALIDA";

/** Codigo e mensagem padrao ficam juntos, no dominio, num unico catalogo: a
 *  tela nao reescreve a mensagem (conventions.md, "Mensagens de erro"). */
export class ErroDeDominio extends Error {
  readonly codigo: CodigoDeErro;

  constructor(codigo: CodigoDeErro, mensagem: string) {
    super(mensagem);
    this.codigo = codigo;
    this.name = new.target.name;
  }
}

export class ErroDeFormatoDeQuantidade extends ErroDeDominio {
  constructor() {
    super("QUANTIDADE.FORMATO_INVALIDO", "Informe a quantidade como um número.");
  }
}

export class ErroDeCasasDecimaisExcedidas extends ErroDeDominio {
  constructor(escala: number) {
    super(
      "QUANTIDADE.CASAS_DECIMAIS_EXCEDIDAS",
      `Informe a quantidade com no máximo ${escala} casas decimais.`,
    );
  }
}

export class ErroDeQuantidadeForaDaFaixa extends ErroDeDominio {
  constructor() {
    super("QUANTIDADE.FORA_DA_FAIXA", "A quantidade informada é grande demais.");
  }
}

export class ErroDeNomeDuplicado extends ErroDeDominio {
  constructor() {
    super(
      "MATERIAL.NOME_DUPLICADO",
      "Já existe um material com este nome. Para registrar novas unidades, abra o material e adicione uma entrada.",
    );
  }
}

export class ErroDeUnidadeImutavel extends ErroDeDominio {
  constructor() {
    super(
      "MATERIAL.UNIDADE_IMUTAVEL",
      "A unidade não pode mudar porque já existem movimentações registradas nesta unidade.",
    );
  }
}

export class ErroDeEstoqueMinimoNegativo extends ErroDeDominio {
  constructor() {
    super("MATERIAL.ESTOQUE_MINIMO_NEGATIVO", "Informe o estoque mínimo como zero ou mais.");
  }
}

export class ErroDeValidadeObrigatoria extends ErroDeDominio {
  constructor() {
    super(
      "MATERIAL.VALIDADE_OBRIGATORIA",
      "Material perecível exige data de fabricação e data de validade.",
    );
  }
}

export class ErroDeMaterialComMovimentacoes extends ErroDeDominio {
  constructor() {
    super(
      "MATERIAL.POSSUI_MOVIMENTACOES",
      "Este material não pode ser excluído porque já possui movimentações.",
    );
  }
}

export class ErroDeQuantidadeNaoPositiva extends ErroDeDominio {
  constructor() {
    super("MOVIMENTACAO.QUANTIDADE_NAO_POSITIVA", "Informe uma quantidade maior que zero.");
  }
}

export class ErroDeSaldoInsuficiente extends ErroDeDominio {
  constructor(saldoDisponivel: string, unidade: string) {
    super(
      "MOVIMENTACAO.SALDO_INSUFICIENTE",
      `Saída recusada: o saldo disponível é de ${saldoDisponivel} ${unidade}.`,
    );
  }
}

export class ErroDeRetiradoPorObrigatorio extends ErroDeDominio {
  constructor() {
    super("MOVIMENTACAO.RETIRADO_POR_OBRIGATORIO", "Informe quem retirou o material.");
  }
}

export class ErroDeJustificativaObrigatoria extends ErroDeDominio {
  constructor() {
    super("MOVIMENTACAO.JUSTIFICATIVA_OBRIGATORIA", "Descreva o motivo do estorno.");
  }
}

export class ErroDeEmailDuplicado extends ErroDeDominio {
  constructor() {
    super(
      "USUARIO.EMAIL_DUPLICADO",
      "Este e-mail já está em uso por outro usuário. Escolha outro e-mail.",
    );
  }
}

export class ErroDeUsuarioInativo extends ErroDeDominio {
  constructor() {
    super("USUARIO.INATIVO", "Este acesso está inativo. Fale com o responsável pelo almoxarifado.");
  }
}

export class ErroDeCredencialInvalida extends ErroDeDominio {
  constructor() {
    super("USUARIO.CREDENCIAL_INVALIDA", "Não foi possível entrar. Confira o e-mail e a senha.");
  }
}
