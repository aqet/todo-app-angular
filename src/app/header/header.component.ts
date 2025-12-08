import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-header',
  imports: [NgFor],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  constructor(private authservice: AuthService){}

  public navigation: any = ['Tableau de bord', 'Projets', 'Equipe'];
  name: string = 'none';
  ngOnInit(): void {
    setTimeout(() => {
      console.log(document.querySelector('a'));

      document.querySelector('a')?.classList.add('buttonCliked');
    }, 1000);
    this.name = JSON.parse(localStorage.getItem('user') || '');
  }

  public undeline(element: any) {
    console.log(element);
    document.querySelectorAll('a').forEach((el) => {
      el.classList.remove('buttonCliked');
      element === el.textContent ? el.classList.toggle('buttonCliked') : '';
    });
  }

  logout() {
    this.authservice.logout();
  }
}
