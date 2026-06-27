// ============================================================================
//  TEST DE COMPOSANT — AppComponent (racine)
// ----------------------------------------------------------------------------
//  AppComponent contient un <router-outlet> et le <app-header>. Il a donc
//  besoin du Router et d'un HttpClient (via AuthService/ThemeService).
//  On fournit des versions de test (provideRouter, provideHttpClientTesting).
//
//  NB : le header enfant lit localStorage 'user' au démarrage -> on le prépare.
// ============================================================================

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.setItem('user', JSON.stringify('bob')); // requis par le header enfant

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),          // un Router de test, sans vraies routes
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  it('doit créer l’application', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('doit avoir le titre "todo-app-angular"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title).toEqual('todo-app-angular');
  });
});
