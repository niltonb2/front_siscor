export class Token {

    static insert(key: string, value: any){
        localStorage.setItem(key, value)
    }

    static get(key: string){
        return localStorage.getItem(key)
    }

    static remove(key: string){
        localStorage.removeItem(key)
    }

    static clearStorage(){
        localStorage.clear()
    }
}