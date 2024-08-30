export class ResponseData<D>{
    data: D | D[] | object;
    status: number;
    message: string
    constructor(data: D | D[] | object,status: number,message: string){
        this.data = data
        this.status = status
        this.message = message
        return this
    }
}