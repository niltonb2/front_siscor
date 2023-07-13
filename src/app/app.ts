import { ICobranca } from "@core/types/ICobranca";

export class App {

    private static _instance: App;

    userInfo: any;
    tokenId: string;
    estabelecimentoSelecionado: string;
    qtdeEstabelecimentos: number;
    faturasCliente: ICobranca[];
    nomeClientePortal: string;


    private constructor() {
        
        const token: any = localStorage.getItem('token');
        if (token) this.tokenId = token;
    }

    public static get Instance(): App {
        return this._instance || (this._instance = new this());
    }


    public setUserInfo(ui: any) {
        this.userInfo = ui;
    }

    public setEstabelecimento(ec: any) {
        this.estabelecimentoSelecionado = ec;
    }

    public setQtdeEstabelecimentos(n: any) {
        this.qtdeEstabelecimentos = n;
    }

    public setFaturasClientes(faturas: ICobranca[]) {
        this.faturasCliente = faturas;
    }

    public setNomeClientePortal(nome: string) {
        this.nomeClientePortal = nome;
    }

}
