export interface IPlano {
    id: number,
    tipo: number,
    descricao: string,
    valor: number,
    informacoes?: any,
    estabelecimento: number,
    created_at?: string,
    updated_at?: string,
    deleted_at?: string,
    deleted?: boolean,
}