export interface ICliente {
    id?: number,
    tipo?: string,
    nome: string,
    documento: string,
    tipo_documento?: string,
    estabelecimento?: number,
    endereco?: number,
    contato?: number,
    bancarios?: null,
    created_at?: string,
    updated_at?: string,
    deleted_at?: string,
    deleted?: boolean
}
