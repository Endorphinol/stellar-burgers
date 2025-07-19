describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    window.localStorage.removeItem('refreshToken');
    cy.clearCookies();
  });

  it('Должен добавлять булку и начинку в конструктор', () => {
    cy.get('[data-testid="ingredient-bun"]')
      .first()
      .trigger('dragstart')
      .get('[data-testid="constructor-dropzone"]')
      .trigger('drop')
      .trigger('dragend');
    cy.get('[data-testid="ingredient-main"]')
      .first()
      .trigger('dragstart')
      .get('[data-testid="constructor-dropzone"]')
      .trigger('drop')
      .trigger('dragend');
    cy.get('[data-testid="constructor-bun"]').should('exist');
    cy.get('[data-testid="constructor-filling"]').should('exist');
  });
});
