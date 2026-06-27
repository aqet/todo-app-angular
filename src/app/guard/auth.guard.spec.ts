// ============================================================================
//  TEST UNITAIRE — authGuard
// ----------------------------------------------------------------------------
//  NOUVEAUTÉ ici : authGuard est une FONCTION (CanActivateFn), pas une classe.
//  Elle utilise inject() à l'intérieur. Pour la tester, on doit l'exécuter
//  DANS un contexte d'injection => TestBed.runInInjectionContext(...).
//
//  But du guard : autoriser /home si connecté, sinon rediriger vers /auth.
// ============================================================================

import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../service/auth.service';

describe('authGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  // Petit utilitaire : exécute le guard dans le bon contexte d'injection.
  // On lui passe deux faux arguments (route + state) car le guard les exige
  // dans sa signature, même s'il ne s'en sert pas.
  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      (authGuard as CanActivateFn)(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      )
    );

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    // On simule AuthService : on contrôlera ce que renvoie isitlogged().
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isitlogged']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });
  });

  // --- CAS PASSANT : utilisateur connecté -> accès autorisé ---
  it('doit autoriser l’accès (true) quand l’utilisateur est connecté', () => {
    authServiceSpy.isitlogged.and.returnValue(true); // on force "connecté"

    const result = runGuard();

    expect(result).toBeTrue();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled(); // pas de redirection
  });

  // --- CAS BLOQUANT : non connecté -> refus + redirection vers /auth ---
  it('doit refuser (false) et rediriger vers /auth quand non connecté', () => {
    authServiceSpy.isitlogged.and.returnValue(false); // on force "déconnecté"

    const result = runGuard();

    expect(result).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/auth');
  });
});
