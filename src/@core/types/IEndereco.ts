export interface IEndereco {
    id?: number,
    tipo_endereco?: string,
    cep: string,
    cidade: string,
    uf: string,
    logradouro: string,
    numero?: string,
    bairro: string,
    complemento?: string,
    created_at?: string,
    updated_at?: string,
    deleted_at?: string,
    deleted?: boolean
}