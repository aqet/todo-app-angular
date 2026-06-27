// ============================================================================
//  TEST E2E — Authentification (parcours utilisateur complet)
//  Scénarios du cahier de recette : TC-AUTH-03 (succès) et TC-AUTH-04 (échec)
// ----------------------------------------------------------------------------
//  Ici on SIMULE le backend avec cy.intercept() : Cypress intercepte l'appel
//  HTTP du frontend et renvoie une réponse maîtrisée. Avantages :
//    - pas besoin de lancer le serveur NestJS ni une base de données ;
//    - le test est DÉTERMINISTE (toujours le même résultat).
//
//  Sélecteurs (vus dans auth.component.html) :
//    input[formControlName="Username"], [formControlName="password"],
//    button[type="submit"].
// ============================================================================

describe('Authentification', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  // --- TC-AUTH-03 : Connexion réussie ---
  it('TC-AUTH-03 — connexion réussie : redirige vers /home et stocke le token', () => {
    // On simule la réponse du backend pour la connexion (succès).
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        isLogged: true,
        Username: 'alice',
        Mail: 'alice@test.com',
        token: 'fake-token',
        RefreshToken: 'fake-refresh',
      },
    }).as('login');

    // Après redirection vers /home, le composant charge les tâches : on stub aussi.
    cy.intercept('GET', '**/todos/', { statusCode: 200, body: [] }).as('todos');

    // ACT : parcours utilisateur réel.
    cy.visit('/auth');
    cy.get('input[formControlName="Username"]').type('alice');
    cy.get('input[formControlName="password"]').type('secret');
    cy.get('button[type="submit"]').click();

    // ASSERT : l'appel a bien eu lieu, on arrive sur /home, le token est stocké.
    cy.wait('@login');
    cy.url().should('include', '/home');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.contain('fake-token');
    });
  });

  // --- TC-AUTH-04 : Connexion échouée (mauvais identifiants) ---
  it('TC-AUTH-04 — connexion échouée : reste sur /auth et affiche une alerte', () => {
    // Le backend répond "non connecté".
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: { isLogged: false },
    }).as('login');

    // Le composant appelle alert(...) en cas d'échec : on espionne window.alert.
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.visit('/auth');
    cy.get('input[formControlName="Username"]').type('alice');
    cy.get('input[formControlName="password"]').type('mauvais');
    cy.get('button[type="submit"]')
      .click()
      .then(() => {
        // L'alerte d'échec a bien été déclenchée.
        expect(alertStub).to.have.been.calledWithMatch(/Login failed/);
      });

    // On doit toujours être sur la page d'authentification.
    cy.wait('@login');
    cy.url().should('include', '/auth');
  });
});
