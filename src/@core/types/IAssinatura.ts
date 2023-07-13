export interface IAssinatura {
    id?: number,
    observacoes?: {
        info?: number
    },
    data_inicio?: string,
    data_fim?: string,
    status?: string,
    estabelecimento?: number,
    pessoa?: number,
    plano?: number,
    created_at?: string,
    updated_at?: string,
    deleted_at?: string,
    deleted?: string,
    tipo: number,
    descricao: string,
    valor: number,
    informacoes?: {
        produto: any
    }
}