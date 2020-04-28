import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { from, Subscription } from 'rxjs';

@Component({

  styleUrls:['./login.component.css'],
  templateUrl:'./login.component.html'
})
export class LoginComponent implements OnInit,OnDestroy{
   isLoading = false;
   private authStatusSub : Subscription;
    constructor(public authService:AuthService){}

    ngOnInit() {
      this.authStatusSub = this.authService.getAuthStatusListner().subscribe(
        authStatus=>{
          this.isLoading = false;
        }
      );
    }
    ngOnDestroy() {
      this.authStatusSub.unsubscribe();
    }

 onLogin(form:NgForm){
    if(form.invalid){
      return;
    }
    this.authService.login(form.value.email,form.value.password);
   // console.log(form.value);
 }


}
