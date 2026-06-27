// ============================================================================
//  TEST E2E — Navigation & Sécurité des routes
//  Scénario du cahier de recette : TC-NAV-01
// ----------------------------------------------------------------------------
//  Particularité : ce test ne nécessite AUCUN backend ni stub. C'est de la
//  pure logique frontend (le guard de route).
//
//  Rappel : un test E2E pilote un vrai navigateur, comme un utilisateur.
//   - cy.visit()  -> ouvre une URL
//   - cy.url()    -> lit l'URL courante
//   - .should()   -> assertion (Cypress réessaie automatiquement jusqu'au succès)
// ============================================================================

describe('TC-NAV-01 — Protection des routes privées', () => {
  it('doit rediriger vers /auth quand on accède à /home sans être connecté', () => {
    // ARRANGE : on s'assure qu'aucune session n'existe.
    cy.clearLocalStorage();

    // ACT : on tente d'accéder directement à la page protégée.
    cy.visit('/home');

    // ASSERT : le guard doit nous renvoyer vers la page d'authentification.
    cy.url().should('include', '/auth');
  });
});
