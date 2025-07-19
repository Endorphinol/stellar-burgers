describe('Тестирование модального окна ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    cy.setCookie('accessToken', 'test');
    window.localStorage.setItem('refreshToken', 'test');

    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);

    cy.get('[data-testid^="ingredient-"]', { timeout: 10000 }).should('exist');
  });

  it('Должно открываться и закрываться по клику на крестик', () => {
    cy.get('[data-testid^="ingredient-"]').first().click();
    cy.get('[data-testid="modal"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="ingredient-details"]').should('exist');
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });
});
