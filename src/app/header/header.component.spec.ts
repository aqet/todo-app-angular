// ============================================================================
//  TEST DE COMPOSANT — HeaderComponent
// ----------------------------------------------------------------------------
//  NOUVEAUTÉS :
//   - le composant dépend de DEUX services (AuthService, ThemeService) ;
//     on les remplace par des doubles via { provide: X, useValue: ... }.
//   - on teste une INTERACTION : un clic sur "Se déconnecter" doit appeler
//     AuthService.logout().
//
//  ATTENTION : ngOnInit fait JSON.parse(localStorage.getItem('user') || '').
//  Si 'user' est absent, JSON.parse('') plante -> on prépare le localStorage.
// ============================================================================

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';
import { AuthService } from '../service/auth.service';
import { ThemeService } from '../service/theme.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['logout']);

    // Le template utilise themeService.darkMode$ (async) et toggleTheme().
    // 3e argument de createSpyObj = propriétés (ici l'observable).
    const themeSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme'], {
      darkMode$: of(true),
    });

    // Indispensable AVANT detectChanges : sinon ngOnInit plante sur JSON.parse.
    localStorage.setItem('user', JSON.stringify('bob'));

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ThemeService, useValue: themeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('doit lire le nom de l’utilisateur depuis le localStorage', () => {
    expect(component.name).toBe('bob');
  });

  // Test direct de la méthode : logout() délègue bien au service.
  it('logout() doit appeler AuthService.logout()', () => {
    component.logout();
    expect(authSpy.logout).toHaveBeenCalled();
  });

  // Test via le DOM : un clic sur l'élément "Se déconnecter" déclenche logout.
  it('un clic sur "Se déconnecter" doit appeler AuthService.logout()', () => {
    // On cherche le <p> qui contient le texte de déconnexion.
    const paragraphs = fixture.debugElement.queryAll(By.css('p'));
    const logoutEl = paragraphs.find((p) =>
      p.nativeElement.textContent.includes('deconnecter')
    );
    expect(logoutEl).withContext('élément de déconnexion introuvable').toBeTruthy();

    logoutEl!.triggerEventHandler('click', null); // simule le clic
    expect(authSpy.logout).toHaveBeenCalled();
  });
});
