import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

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

  private getStorageValue(key: string): string {
    const stored = localStorage.getItem(key);
    if (!stored) return '';
    try {
      return JSON.parse(stored);
    } catch {
      return stored;
    }
  }

  getUserName(id: string) {
    const accessToken = this.getToken();

    return this.http.post(
      'http://localhost:3000/auth/user',
      { id: id },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        }),
      },
    );
  }

  refreshToken() {
    const accessToken = localStorage.getItem('RefreshToken');
    if (!accessToken) return this.http.post('http://localhost:3000/auth/refresh', { token: '' }, {} as any);

    let refreshToken = '';
    try {
      refreshToken = JSON.parse(accessToken);
    } catch {
      refreshToken = accessToken;
    }

    return this.http.post(
      'http://localhost:3000/auth/refresh',
      { token: refreshToken },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + refreshToken,
        }),
      },
    );
  }

  private getToken(): string {
    const stored = localStorage.getItem('token');
    if (!stored) return '';
    try {
      return JSON.parse(stored);
    } catch {
      return stored;
    }
  }

  getProfile() {
    const accessToken = this.getToken();
    return this.http.get('http://localhost:3000/auth/me', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      }),
    });
  }

  updatePhoto(file: any) {
    const accessToken = this.getToken();
    const formData = new FormData();
    formData.append('image', file);
    formData.append('Username', this.getStorageValue('user'));

    return this.http.post('http://localhost:3000/auth/update-photo', formData, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + accessToken,
      }),
    });
  }
}
