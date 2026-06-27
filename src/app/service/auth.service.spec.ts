// ============================================================================
//  TEST UNITAIRE — AuthService
// ----------------------------------------------------------------------------
//  But : valider la logique du service d'authentification SANS vrai backend
//        et SANS vraie navigation. On simule HTTP et le Router.
// ============================================================================

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
// provideHttpClient + provideHttpClientTesting : la façon moderne (Angular 17+)
// de fournir un HttpClient "factice" contrôlable dans les tests.
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  // Variables partagées entre les tests du bloc.
  let service: AuthService;            // l'objet qu'on teste
  let httpMock: HttpTestingController; // le "faux serveur" HTTP
  let routerSpy: jasmine.SpyObj<Router>; // un faux Router qui enregistre les appels

  // beforeEach s'exécute AVANT chaque "it". On repart d'un contexte propre.
  beforeEach(() => {
    // On crée un espion (spy) : un faux Router avec seulement la méthode
    // navigateByUrl. Il ne navigue pas vraiment, mais il MÉMORISE les appels.
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    // === ARRANGE : configuration du module de test ===
    TestBed.configureTestingModule({
      providers: [
        AuthService,                 // le service réel à tester
        provideHttpClient(),         // HttpClient...
        provideHttpClientTesting(),  // ...mais en version testable (interceptée)
        { provide: Router, useValue: routerSpy }, // remplace le vrai Router par notre espion
      ],
    });

    // TestBed.inject = "donne-moi l'instance" (comme l'injection de dépendances Angular)
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // On part d'un localStorage vide pour des tests déterministes.
    localStorage.clear();
  });

  // afterEach s'exécute APRÈS chaque test : on vérifie qu'aucune requête HTTP
  // attendue n'a été oubliée (bonne pratique : pas de requête "fantôme").
  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // --- Test de base : le service existe bien ---
  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  // --- register() doit POSTer les infos sur /auth/register ---
  it('register() doit envoyer un POST sur /auth/register avec le bon corps', () => {
    const fakeUser = { Username: 'bob', email: 'bob@test.com', password: '123' };

    // ACT : on souscrit (sinon l'observable HTTP ne part pas).
    service.register(fakeUser).subscribe();

    // ASSERT : on intercepte la requête et on vérifie son URL/méthode/corps.
    const req = httpMock.expectOne('http://localhost:3000/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(fakeUser);

    // On simule la réponse du serveur (sinon httpMock.verify() râlerait).
    req.flush({ ok: true });
  });

  // --- login() doit POSTer { Username, password } sur /auth/login ---
  it('login() doit envoyer un POST sur /auth/login avec Username et password', () => {
    service.login('alice', 'secret').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    expect(req.request.method).toBe('POST');
    // Attention : le service renomme la clé en "Username" (majuscule).
    expect(req.request.body).toEqual({ Username: 'alice', password: 'secret' });

    req.flush({ isLogged: true, token: 'abc' });
  });

  // --- isitlogged() : cas limite, localStorage vide doit renvoyer false ---
  it('isitlogged() doit renvoyer false quand rien n’est stocké', () => {
    // localStorage est vide (vidé dans beforeEach)
    expect(service.isitlogged()).toBeFalse();
  });

  // --- isitlogged() : doit renvoyer true quand "isloged" vaut true ---
  it('isitlogged() doit renvoyer true quand isloged = true', () => {
    localStorage.setItem('isloged', JSON.stringify(true));
    expect(service.isitlogged()).toBeTrue();
  });

  // --- logout() : nettoie le stockage et redirige vers /auth ---
  it('logout() doit mettre isloged à false, retirer le token et naviguer vers /auth', () => {
    // ARRANGE : on simule un utilisateur connecté.
    localStorage.setItem('isloged', JSON.stringify(true));
    localStorage.setItem('token', JSON.stringify('mon-token'));

    // ACT
    service.logout();

    // ASSERT : état du stockage...
    expect(localStorage.getItem('isloged')).toBe('false');
    expect(localStorage.getItem('token')).toBeNull();
    // ...et la redirection a bien été demandée (sur notre espion).
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/auth');
  });

  // --- getUserName() : doit envoyer l'en-tête Authorization Bearer ---
  it('getUserName() doit inclure l’en-tête Authorization avec le token', () => {
    // Le service lit le token via JSON.parse(localStorage.getItem('token')).
    localStorage.setItem('token', JSON.stringify('mon-token'));

    service.getUserName('42').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/auth/user');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ id: '42' });
    expect(req.request.headers.get('Authorization')).toBe('Bearer mon-token');

    req.flush({ Username: 'bob' });
  });
});
