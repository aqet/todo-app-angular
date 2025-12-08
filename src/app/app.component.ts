import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { filter, map, Observable, startWith } from 'rxjs';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NgIf, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'todo-app-angular';
  isAuth$!: Observable<boolean>;
  currentUrl$!: Observable<string>;
// constructor(){}
  constructor(private router: Router, private authservice: AuthService) {
    this.currentUrl$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: any) => event.urlAfterRedirects ?? event.url),
      startWith(this.router.url) // première valeur au démarrage
    );
  }
  ngOnInit(): void {
    this.isAuth$ = this.currentUrl$.pipe(
      map((url) => url.startsWith('/auth')) // true si on est sur /auth
    );
  }

  // ngOnInit(): void {
  //   this.isAuth$=this.currentUrl$.pipe(
  //     map((url)=>url.startsWith('/auth')),
  //     // this.authservice.isitlogged()
  //   ) 
  // }

  // ngOnInit(): void {
  //   setTimeout(() => {
  //     this.isAuth = this.router.isActive('/auth', true);
  //   }, 100);
  // }
}
