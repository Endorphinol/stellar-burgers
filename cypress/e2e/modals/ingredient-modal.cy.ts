describe('Модальное окно ингридента', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  test('Должно происходить и закрытие модального окна', () => {
    cy.get('[data-testid="ingredient"]').first().click();
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
    cy.get('[data-testid="ingredient"]').first().click();
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  test('Должны отобразиться корректные детали ингридента', () => {
    cy.get('[data-testid="ingredient"]').first().click();
    cy.fixture('ingredients.json').then((ingredients) => {
      const ingredient = ingredients.data[0];
      cy.get('[data-testid="ingredient-name"]').should(
        'contain',
        ingredient.name
      );
      cy.get('[data-testid="ingredient-price"]').should(
        'contain',
        ingredient.price
      );
    });
  });
});
