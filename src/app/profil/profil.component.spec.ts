// ============================================================================
//  TEST DE COMPOSANT — ProfilComponent
// ----------------------------------------------------------------------------
//  Le composant le plus simple : aucune dépendance (pas de service).
//  On apprend ici la base : créer le composant via TestBed + ComponentFixture.
// ============================================================================

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilComponent } from './profil.component';

describe('ProfilComponent', () => {
  let component: ProfilComponent;
  let fixture: ComponentFixture<ProfilComponent>;

  beforeEach(async () => {
    // Un composant standalone se déclare dans "imports".
    await TestBed.configureTestingModule({
      imports: [ProfilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // déclenche ngOnInit + premier rendu
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  // ngOnInit remplit "user" (ici codé en dur dans le composant).
  it('doit charger un utilisateur au démarrage', () => {
    expect(component.user).toBeTruthy();
    expect(component.user.username).toBe('ii2');
  });

  // formatDate() est une fonction "pure" : facile et idéale à tester.
  it('formatDate() doit formater une date ISO en format français', () => {
    const result = component.formatDate('2025-12-04T17:20:04.203+00:00');
    // toLocaleDateString('fr-FR', ...) -> ex. "4 décembre 2025"
    expect(result).toContain('2025');
    expect(result).toContain('décembre');
  });
});
