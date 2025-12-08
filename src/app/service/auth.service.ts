import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router, private http: HttpClient) {}
  

  register(info: {}) {
    return this.http.post('http://localhost:3000/auth/register', info);
  }

  // login(username: string, password: string) {
  //   // if (JSON.parse(localStorage.getItem('user')??'').username == username && JSON.parse(localStorage.getItem('user')??'').password == password){
  //   //     localStorage.setItem('isloged', JSON.stringify(true))
  //   //     console.log(username, password);

  //   //     return true
  //   // }
  //   // return false
  //   return this.http.post
  //   const user = { username: username, password:password };

  //   // return this.http.post('http://localhost:3000/auth', user);
  // }

  login(username: string, password: string) {
    const user = { Username: username, password: password };
    return this.http.post('http://localhost:3000/auth/login', user);
  }
  isitlogged() {
    return JSON.parse(localStorage.getItem('isloged')?.toString() || 'false');
  }

  logout() {
    localStorage.setItem('isloged', JSON.stringify(false));
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth');
  }

  getUserName(id: string) {
    const accessToken = JSON.parse(localStorage.getItem('token') || '');
    console.log('Bearer ' + accessToken);
    
    return this.http.post('http://localhost:3000/auth/user', {id: id}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      }),
    });
  }
}
