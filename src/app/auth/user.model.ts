export class User{

    constructor(public email: string, public id: string, private _token: string, private _tokenExipartionDate: Date){}

    get token(){
        if(! this._tokenExipartionDate || new Date() > this._tokenExipartionDate ){
            return null;
        }
        return this._token
    }
}