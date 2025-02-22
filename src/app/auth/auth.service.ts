import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { ConfigService } from '../utils/config.service';




interface AuthResponseData{
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  googleApiConfig: { baseUrl: string, apiKey: string } | undefined;

  constructor(private http: HttpClient, private router : Router, private configService: ConfigService) {}

  signup(email: string, password: string){
    //return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCgUgx2E1ePeENpz5jrlPYjZeZHXojxkNA',
    return this.http.post<AuthResponseData>(this.configService.getGoogleApiBaseUrl() + '/v1/accounts:signUp?key=' + this.configService.getGoogleApiKey(),
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(catchError(
      errorRes => {
        return throwError(() => new Error(errorRes.error.error.message));
      }
    ))
  }

  login(email: string, password: string){
    //return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCgUgx2E1ePeENpz5jrlPYjZeZHXojxkNA',
    //console.log('stringa: ' + this.configService.getGoogleApiBaseUrl() + 'v1/accounts:signInWithPassword?key='  + this.configService.getGoogleApiKey());
    return this.http.post<AuthResponseData>( this.configService.getGoogleApiBaseUrl() + '/v1/accounts:signInWithPassword?key='  + this.configService.getGoogleApiKey() ,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(
        errorRes => {
          return throwError(() => new Error(errorRes.error.error.message));
        }
      ), tap(
        resData => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }
      )
    )
  }

  autoLogin() : boolean {
    //riconverto il json in oggetto)
    const userData :{
      email: string,
      id: string,
      _token: string
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));  
    if (!userData) {
      return false;
    }
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if(loadedUser.token){
      this.user.next(loadedUser);
      return true;
    }
    return false;
  }

  logout(){
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(["./auth"]);
  }

  private handleAuthentication(email: string, userId: string,  token: string, expiresIn : number ){
    const expirtionDate = new Date( new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirtionDate);
    this.user.next(user);
    localStorage.setItem('userData' , JSON.stringify(user)); //converto l'oggetto in una stringa json
  } 


}
