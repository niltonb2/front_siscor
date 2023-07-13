export interface IGateway {
    id?: number,
    nome: string,
    marketplace_id: string,
    seller_id: string,
    pagamento_cartao?: boolean,
    qtde_max_parcelas?: any,
    valor_min_parcelas?: number,
    created_at?: string,
    updated_at?: string,
    deleted_at?: string,
    deleted?: boolean
}