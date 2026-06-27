// ============================================================================
//  TEST DE COMPOSANT — HomeComponent
// ----------------------------------------------------------------------------
//  Composant le plus riche (drag & drop, appels API). On se concentre sur la
//  logique testable simplement, avec les deux services entièrement mockés :
//   - taskService.allTasks() renvoie une liste -> doit alimenter component.tables
//   - openCloseModal() bascule l'affichage de la modale
// ============================================================================

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { taskService } from '../service/task.service';
import { AuthService } from '../service/auth.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let taskSpy: jasmine.SpyObj<taskService>;
  let authSpy: jasmine.SpyObj<AuthService>;

  // Données factices renvoyées par le "backend" simulé.
  const fakeTasks = [
    { title: 'A faire', tasks: [] },
    { title: 'Terminé', tasks: [] },
  ];

  beforeEach(async () => {
    taskSpy = jasmine.createSpyObj('taskService', ['allTasks', 'addTask', 'initTask']);
    authSpy = jasmine.createSpyObj('AuthService', ['getUserName', 'refreshToken', 'logout']);

    // gettask() (appelé dans ngOnInit) souscrit à allTasks() : on renvoie nos données.
    taskSpy.allTasks.and.returnValue(of(fakeTasks));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: taskService, useValue: taskSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    // NB : on n'appelle PAS fixture.detectChanges() ici.
    // Le template de Home est riche et allTasks() émet de façon synchrone :
    // rendre le template pendant cette émission déclencherait NG0100.
    // Pour un test de LOGIQUE, on déclenche ngOnInit() nous-mêmes (voir tests).
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  // gettask() (via ngOnInit) doit alimenter component.tables avec la réponse.
  it('doit charger les tâches dans component.tables au démarrage', () => {
    component.ngOnInit(); // déclenche gettask() sans rendre le template
    expect(taskSpy.allTasks).toHaveBeenCalled();
    expect(component.tables.length).toBe(2);
    expect(component.tables[0].title).toBe('A faire');
  });

  // openCloseModal() bascule simplement un booléen d'affichage.
  it('openCloseModal() doit basculer l’état de la modale', () => {
    expect(component.modal).toBeFalse();
    component.openCloseModal();
    expect(component.modal).toBeTrue();
    component.openCloseModal();
    expect(component.modal).toBeFalse();
  });
});
