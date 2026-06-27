import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // L'application Angular tourne sur ce port (commande: ng serve).
    baseUrl: 'http://localhost:4200',
    // Où Cypress cherche les tests E2E.
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    // On garde la fenêtre par défaut ; pas de config serveur nécessaire.
  },
});
