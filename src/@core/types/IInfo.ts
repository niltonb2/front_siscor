import { IUsuario } from "./IUsuario";

export interface IInfo {
    info: string;
    token?: string;
    usuario?: IUsuario;
    idPessoa?: number;
    idEstabelecimento?: any;
    ecs?: number;
}