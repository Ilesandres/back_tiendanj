export class MessageDto{
    message:string[]=[];

    constructor(mesage:string){
        this.message[0]=mesage;
    }
}