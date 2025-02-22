import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class MainService {

  
  constructor(protected http: HttpClient) {}

  getToken() : string | null {
    //riconverto il json in oggetto)
    const userData :{
      email: string,
      id: string,
      _token: string
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));  
    if (!userData) {
      return null;
    }
    return userData._token;
  }

}
