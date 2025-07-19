describe('Тестирование модального окна ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    cy.setCookie('accessToken', 'fake-access-token');

    cy.visit('/');

    cy.wait('@getIngredients');
    cy.get('[data-testid="ingredient-list"]').should('be.visible');
  });

  it('Должно открываться и закрываться по клику на крестик', () => {
    cy.get('[data-testid="ingredient-item"]').first().click();
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });
});
