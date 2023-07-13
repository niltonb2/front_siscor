import { ICobDash } from "./ICobDash";

export interface IDash {
    pagos: ICobDash[],
    abertos: ICobDash[],
    vencidos: ICobDash[],
    pendentes: ICobDash[]
}