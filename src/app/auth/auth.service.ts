import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from "./auth-data.model";


import { environment } from '../../environments/environment';

const  BACKEND_URL = environment.apiUrl + "/user/";


@Injectable({ providedIn: "root" })
export class AuthService{
  private token: string;
  private tokenTimer : any;
  private userId: string;
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

  getUserId(){
    return this.userId;
  }

  createUser(email: string, password: string ){
    const authData :AuthData = {email: email, password : password};
     return this.http.post(BACKEND_URL + "/signup",authData)
     .subscribe( ()=> {
      this.router.navigate['/'];
     }, error =>{
       this.authStatusListner.next(false);
     });
  }

  login(email: string, password: string ){
    const authData :AuthData = {email: email, password : password};
      this.http.post<{token:string,expiresIn: number, userId: string}>(BACKEND_URL + "/login",authData)
      .subscribe(response =>{
        const token  = response.token;
        this.token = token;
        if(token){
          const expiresInduration = response.expiresIn;
          this.setAuthTimer(expiresInduration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListner.next(true);
          const now = new Date();
          const expirationDate =new Date(now.getTime() + expiresInduration * 1000);
          this.saveAuthData(token, expirationDate,this.userId);
          this.router.navigate(['/']);
        }
      }, error =>{
        this.authStatusListner.next(false);
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
      this.userId = authInformation.userId;
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
    this.userId = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token:string, expiresInDate:Date, userId : string){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expiresInDate.toISOString());
    localStorage.setItem('userId',userId);
  }
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userID");
    if(!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate : new Date(expirationDate),
      userId: this.userId
    }
  }
}
