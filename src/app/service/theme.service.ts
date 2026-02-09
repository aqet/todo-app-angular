import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(this.getInitialTheme());
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    this.applyTheme(this.darkMode.value);
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  }

  toggleTheme() {
    const newValue = !this.darkMode.value;
    this.darkMode.next(newValue);
    localStorage.setItem('darkMode', JSON.stringify(newValue));
    this.applyTheme(newValue);
  }

  private applyTheme(isDark: boolean) {
    document.body.classList.toggle('light-theme', !isDark);
  }
}
