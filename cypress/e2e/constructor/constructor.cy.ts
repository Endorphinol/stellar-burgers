describe('Конструктор бургера', () => {
  afterEach(() => {
    window.localStorage.removeItem('refreshToken');
    cy.clearCookies();
  });
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });
  test('should add bun and filling to constructor', () => {
    cy.get('[data-testid="ingredient-bun"]')
      .first()
      .drag('[data-testid="constructor-dropzone"]');
    cy.get('[data-testid="ingredient-main"]')
      .first()
      .drag('[data-testid="constructor-dropzone"]');
    cy.get('[data-testid="constructor-bun"]').should('exist');
    cy.get('[data-testid="constructor-filling"]').should('exist');
  });
});
