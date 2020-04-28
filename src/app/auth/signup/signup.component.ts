import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { from, Subscription } from 'rxjs';

@Component({

  styleUrls:['./signup.component.css'],
  templateUrl:'./signup.component.html'
})
export class SignupComponent implements OnInit,OnDestroy{

  isLoading = false;
  private authStatusSub : Subscription;
  constructor(public authService:AuthService){}
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListner().subscribe(
      authStatus=>{
        this.isLoading = false;
      }
    );
  }

 onSignup(form:NgForm){
   if (form.invalid){
     return;
   }
   console.log(form.value);
   this.isLoading = true;
   this.authService.createUser(form.value.email,form.value.password)
 }
}
