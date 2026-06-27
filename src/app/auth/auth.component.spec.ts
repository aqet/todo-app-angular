// ============================================================================
//  TEST DE COMPOSANT — AuthComponent
// ----------------------------------------------------------------------------
//  NOUVEAUTÉS :
//   - tester un FORMULAIRE réactif (validité selon les Validators) ;
//   - tester la SOUMISSION : submit('login') doit appeler AuthService.login,
//     et en cas de succès rediriger vers /home.
//
//  Le service mocké renvoie un Observable (of(...)) car le composant
//  fait .subscribe() sur le résultat.
// ============================================================================

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthComponent } from './auth.component';
import { AuthService } from '../service/auth.service';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  // --- VALIDATION : Username et password sont obligatoires ---
  it('le formulaire doit être invalide quand il est vide', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('le formulaire doit devenir valide une fois rempli', () => {
    component.form.setValue({
      email: 'a@b.com',
      Username: 'alice',
      password: 'secret',
    });
    expect(component.form.valid).toBeTrue();
  });

  // --- SOUMISSION login : appelle le service avec username + password ---
  it('submit("login") doit appeler AuthService.login avec les identifiants', () => {
    // Le service renvoie une connexion réussie.
    authSpy.login.and.returnValue(
      of({ isLogged: true, Username: 'alice', Mail: 'a@b.com', token: 't', RefreshToken: 'r' })
    );
    component.form.setValue({ email: '', Username: 'alice', password: 'secret' });

    component.submit('login');

    expect(authSpy.login).toHaveBeenCalledWith('alice', 'secret');
  });

  // --- SOUMISSION login réussie : redirige vers /home et stocke le token ---
  it('submit("login") doit rediriger vers /home en cas de succès', () => {
    authSpy.login.and.returnValue(
      of({ isLogged: true, Username: 'alice', Mail: 'a@b.com', token: 't', RefreshToken: 'r' })
    );
    component.form.setValue({ email: '', Username: 'alice', password: 'secret' });

    component.submit('login');

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/home');
    expect(localStorage.getItem('token')).toBe(JSON.stringify('t'));
  });

  // --- SOUMISSION register : appelle AuthService.register ---
  it('submit("register") doit appeler AuthService.register', () => {
    authSpy.register.and.returnValue(
      of({ Username: 'alice', Mail: 'a@b.com', isLogged: true, token: 't', RefreshToken: 'r' })
    );
    component.form.setValue({ email: 'a@b.com', Username: 'alice', password: 'secret' });

    component.submit('register');

    expect(authSpy.register).toHaveBeenCalled();
  });

  // --- switchTo() bascule le mode login <-> register ---
  it('switchTo() doit basculer le mode de login vers register', () => {
    expect(component.mode).toBe('login');
    component.switchTo();
    expect(component.mode).toBe('register');
  });
});
