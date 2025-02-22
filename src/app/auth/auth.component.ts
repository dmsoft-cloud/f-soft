import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'dms-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  
  isSignup = false;
  isLoading =false;
  error: string = null;

  constructor(private authService : AuthService, private router : Router){}

  ngOnInit(): void {
    
  }

  onSubmit(form : NgForm){
    const email= form.value.email;
    const password= form.value.email;
    this.isLoading= true;
    if (this.isSignup) {
      this.authService.signup(email, password).pipe(tap({
        next: resData => {
          console.log('Dati ricevuti:', resData);
          this.isLoading=false;
          this.error=null;
        },
        error: err => { 
          console.log('Errore: ', err);
          this.error = 'Error on signup!  ' + err
          this.isLoading= false;
        }
        })
      ).subscribe();
    } else {
      this.authService.login(email, password).pipe(tap({
        next: resData => {
          console.log('Dati ricevuti:', resData);
          this.isLoading=false;
          this.error=null;
          this.router.navigate(["./dashboard"]);
        },
        error: err => { 
          console.log('Errore: ', err);
          this.error = 'Error on login!  ' + err
          this.isLoading= false;
        }
        })
      ).subscribe();

    }

    form.reset();
  }


  activeLogin(event: MouseEvent){
    event.preventDefault();
    this.isSignup=false;
  }

  activeSignup(event: MouseEvent){
    event.preventDefault();
    this.isSignup=true;
  }

}
