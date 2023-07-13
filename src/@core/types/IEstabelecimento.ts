export interface IEstabelecimento {
    id?: number;
    nome: string;
    documento: string;
    tipo_documento: string;
    fantasia?: string;
    endereco?: number;
    contato?: number;
    bancarios?: number;
    gateway?: number;
    configuracoes?: any;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    deleted?: boolean;
}