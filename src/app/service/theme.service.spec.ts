// ============================================================================
//  TEST UNITAIRE — ThemeService
// ----------------------------------------------------------------------------
//  NOUVEAUTÉS :
//   - tester un Observable (darkMode$) en y souscrivant ;
//   - vérifier un effet sur le DOM réel (classe CSS sur <body>) ;
//   - vérifier la persistance dans localStorage.
//
//  NB : le service lit localStorage DANS son constructeur. Il faut donc
//  préparer le localStorage AVANT de demander l'instance (TestBed.inject).
// ============================================================================

import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  // Fabrique une instance après avoir éventuellement préparé le localStorage.
  function createService(): ThemeService {
    TestBed.configureTestingModule({ providers: [ThemeService] });
    return TestBed.inject(ThemeService);
  }

  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove('light-theme'); // état DOM propre
  });

  it('devrait être créé', () => {
    expect(createService()).toBeTruthy();
  });

  // --- Valeur initiale : true (mode sombre) quand rien n'est stocké ---
  it('doit démarrer en mode sombre par défaut (darkMode$ = true)', () => {
    const service = createService();

    let current: boolean | undefined;
    service.darkMode$.subscribe((v) => (current = v)); // on lit la valeur émise
    expect(current).toBeTrue();
  });

  // --- toggleTheme() : bascule la valeur, persiste et applique la classe CSS ---
  it('toggleTheme() doit passer en mode clair et ajouter la classe light-theme', () => {
    const service = createService(); // démarre en sombre (true)

    service.toggleTheme(); // -> devient clair (false)

    // 1) La valeur de l'observable a basculé.
    let current: boolean | undefined;
    service.darkMode$.subscribe((v) => (current = v));
    expect(current).toBeFalse();

    // 2) La préférence est persistée.
    expect(localStorage.getItem('darkMode')).toBe('false');

    // 3) Effet DOM : en mode clair, la classe light-theme est présente.
    expect(document.body.classList.contains('light-theme')).toBeTrue();
  });

  // --- Lecture de la préférence sauvegardée au démarrage ---
  it('doit lire la préférence sauvegardée dans localStorage au démarrage', () => {
    localStorage.setItem('darkMode', JSON.stringify(false)); // préparé AVANT inject
    const service = createService();

    let current: boolean | undefined;
    service.darkMode$.subscribe((v) => (current = v));
    expect(current).toBeFalse();
  });
});
