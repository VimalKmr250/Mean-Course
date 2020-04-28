import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from "./auth-data.model";


@Injectable({ providedIn: "root" })
export class AuthService{
  private token: string;
  private tokenTimer : any;
  private isAuthenticated = false;
  private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken(){
    return this.token;
  }
  getIsAuth(){
   return this.isAuthenticated;
  }

  getAuthStatusListner(){
    return this.authStatusListner.asObservable();
  }


  createUser(email: string, password: string ){
    const authData :AuthData = {email: email, password : password};
      this.http.post("http://localhost:3000/api/user/signup",authData)
      .subscribe(response =>{
        console.log(response);
      });
  }

  login(email: string, password: string ){
    const authData :AuthData = {email: email, password : password};
      this.http.post<{token:string,expiresIn: number}>("http://localhost:3000/api/user/login",authData)
      .subscribe(response =>{
        const token  = response.token;
        this.token = token;
        if(token){
          const expiresInduration = response.expiresIn;
          this.setAuthTimer(expiresInduration);
          this.isAuthenticated = true;
          this.authStatusListner.next(true);
          const now = new Date();
          const expirationDate =new Date(now.getTime() + expiresInduration * 1000);
          this.saveAuthData(token, expirationDate)
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0){
      this.setAuthTimer(expiresIn/1000);
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.authStatusListner.next(true);
    }
  }

  private setAuthTimer(duration : number) {
    console.log("Setting time:" + duration);
    this .tokenTimer = setTimeout(() => {
      this.logout();
    },duration * 1000);
  }
  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token:string, expiresInDate:Date){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expiresInDate.toISOString());
  }
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if(!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate : new Date(expirationDate)
    }
  }
}