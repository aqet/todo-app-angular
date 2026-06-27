// ============================================================================
//  TEST UNITAIRE — taskService
// ----------------------------------------------------------------------------
//  Même recette que AuthService (faux serveur HTTP + localStorage maîtrisé).
//  NOUVEAUTÉ : updateTask() appelle .subscribe() EN INTERNE -> la requête part
//  toute seule, on n'a pas besoin de souscrire nous-mêmes.
// ============================================================================

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { taskService } from './task.service';

describe('taskService', () => {
  let service: taskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        taskService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(taskService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
    // Le token est lu via JSON.parse, on le pose au format JSON valide.
    localStorage.setItem('token', JSON.stringify('mon-token'));
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  // --- initTask() : remplit le localStorage avec 3 colonnes par défaut ---
  it('initTask() doit initialiser 3 colonnes dans le localStorage', () => {
    service.initTask();

    const stored = JSON.parse(localStorage.getItem('tasks') || '[]');
    expect(stored.length).toBe(3);
    expect(stored[0].title).toBe('A faire');
  });

  // --- allTasks() : GET sur /todos/ avec en-tête Authorization ---
  it('allTasks() doit faire un GET sur /todos/ avec le token', () => {
    service.allTasks().subscribe();

    const req = httpMock.expectOne('http://localhost:3000/todos/');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mon-token');

    req.flush([]); // on simule une liste vide
  });

  // --- addTask() : PATCH sur /todos/ avec le corps { info } ---
  it('addTask() doit faire un PATCH sur /todos/ avec les infos de la tâche', () => {
    const info = { task: 'Acheter du pain', mail: 'a@b.com' };

    service.addTask(info).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/todos/');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ info });
    expect(req.request.headers.get('Authorization')).toBe('Bearer mon-token');

    req.flush({ ok: true });
  });

  // --- updateTask() : PUT sur /todos/update (souscrit en interne) ---
  it('updateTask() doit faire un PUT sur /todos/update', () => {
    // updateTask lit aussi 'user' et 'mail' dans le localStorage (JSON.parse).
    localStorage.setItem('user', JSON.stringify('bob'));
    localStorage.setItem('mail', JSON.stringify('bob@test.com'));

    // Pas de .subscribe() ici : la méthode le fait elle-même.
    service.updateTask({ id: 1 }, 'A faire', 'Terminé');

    const req = httpMock.expectOne('http://localhost:3000/todos/update');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.last).toBe('A faire');
    expect(req.request.body.next).toBe('Terminé');

    req.flush({ ok: true });
  });
});
