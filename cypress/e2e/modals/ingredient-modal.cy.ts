describe('Тестирование модального окна ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    window.localStorage.removeItem('refreshToken');
    cy.clearCookies();
  });

  it('Должно открываться и закрываться по клику на крестик', () => {
    cy.get('[data-testid="ingredient"]').first().click();
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Должно закрываться по клику на оверлей', () => {
    cy.get('[data-testid="ingredient"]').first().click();
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Должно отображать корректные данные ингредиента', () => {
    cy.get('[data-testid="ingredient"]').first().click();
    cy.fixture('ingredients.json').then((ingredients) => {
      const ingredient = ingredients.data[0];
      cy.get('[data-testid="ingredient-name"]').should(
        'have.text',
        ingredient.name
      );
      cy.get('[data-testid="ingredient-price"]').should(
        'contain',
        ingredient.price
      );
    });
  });
});
