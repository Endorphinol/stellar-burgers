describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.intercept('POST', '/api/orders', {
      statusCode: 200,
      body: { order: { number: 12345 } }
    }).as('createOrder');

    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    cy.setCookie('accessToken', 'fake-access-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    window.localStorage.removeItem('refreshToken');
    cy.clearCookies();
  });

  it('Должен создавать заказ и сбрасывать конструктор', () => {
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

    cy.get('button').contains('Оформить заказ').click();
    cy.wait('@createOrder').then(() => {
      cy.get('[data-testid="order-number"]').should('contain', '12345');
      cy.get('[data-testid="modal-close"]').click();

      cy.get('[data-testid="constructor-bun"]').should('not.exist');
      cy.get('[data-testid="constructor-filling"]').should('not.exist');
    });
  });
});
