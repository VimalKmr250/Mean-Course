import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { from } from 'rxjs';

@Component({

  styleUrls:['./signup.component.css'],
  templateUrl:'./signup.component.html'
})
export class SignupComponent {

  constructor(public authService:AuthService){}

 isLoading = false;

 onSignup(form:NgForm){
   if (form.invalid){
     return;
   }
   console.log(form.value);
    this.authService.createUser(form.value.email,form.value.password);
 }
}
