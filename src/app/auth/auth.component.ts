import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: [''],
      Username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  mode: 'login' | 'register' = 'login';

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    Username: new FormControl(''),
    password: new FormControl(''),
  });

  submit(type: string) {
    console.log(type);
    let res: any;
    type == 'register'
      ? this.authservice
          .register(this.form.value)
          .subscribe(
            (res: any) => (
              localStorage.setItem('user', JSON.stringify(res.Username)),
              localStorage.setItem('isloged', JSON.stringify(res.isLogged)),
              localStorage.setItem('token', JSON.stringify(res.token)),
              this.router.navigateByUrl('/home')
            )
          )
      : ((res = this.authservice
          .login(this.form.value.Username, this.form.value.password)
          .subscribe((res: any) => {
            res.isLogged == true ? (
            localStorage.setItem('user', JSON.stringify(res.Username)),
              localStorage.setItem('isloged', JSON.stringify(res.isLogged)),
              localStorage.setItem('token', JSON.stringify(res.token)),
              this.router.navigateByUrl('/home')
            ):(
              alert('Login failed! Please check your username and password.')
            )
          }))
        // res ? this.router.navigateByUrl('/home') : '');
  )}

  switchTo() {
    if (this.mode == 'login') {
      const element = document.querySelector(
        '.rightSideBarContent'
      ) as HTMLElement;
      // console.log(element);
      if (element) {
        if (element.parentElement)
          (element.parentElement.style.justifyContent = 'start'),
            (element.style.borderRadius = '0 10px 50% 0');
      }
      this.mode = 'register';
    } else {
      const element = document.querySelector(
        '.rightSideBarContent'
      ) as HTMLElement;
      // console.log(element);
      if (element) {
        if (element.parentElement)
          (element.parentElement.style.justifyContent = 'end'),
            (element.style.borderRadius = '10px 0 0 50%');
      }
      this.mode = 'login';
    }
  }

  onSubmitLogin(event: Event) {
    event.preventDefault();
    // logique de connexion ici
    console.log('submit login');
  }

  onSubmitRegister(event: Event) {
    event.preventDefault();
    // logique d'inscription ici
    console.log('submit register');
  }
}
