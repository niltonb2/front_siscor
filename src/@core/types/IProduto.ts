export interface IProduto {
    id: number,
    tipo: number,
    descricao: string,
    valor: number,
    estabelecimento: number,
    created_at?: string,
    updated_at?: string,
    deleted_at?: string,
    deleted?: boolean,
}