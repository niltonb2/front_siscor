export interface IEstabelecimentoCompleto {
    id?: number;
    nome: string;
    documento: string;
    tipo_documento: string;
    endereco?: number;
    contato?: number;
    bancarios?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    deleted?: boolean;
    telefone: string,
    celular: string,
    telefone_comercial: string,
    email: string,
    fantasia: string,
    gateway: number,
    tipo_endereco: string,
    cep: string,
    cidade: string,
    uf: string,
    logradouro: string,
    numero: string,
    bairro: string,
    estado: string,
    complemento: string,
    marketplace_id: string,
    seller_id: string,
    nome_gateway: string,
    nome_estabelecimento: string,
    pagamento_cartao?: boolean,
    valor_min_parcelas?: string,
    qtde_max_parcelas?: string
}