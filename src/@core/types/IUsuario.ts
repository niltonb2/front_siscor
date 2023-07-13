export interface IUsuario {
    id?: number;
    nome?: string;
    email: string;
    senha?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    deleted?: boolean;
    estabelecimento_selecionado?: number;
}