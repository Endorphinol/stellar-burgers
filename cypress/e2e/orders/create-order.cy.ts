describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    cy.setCookie('accessToken', 'fake-access-token');
    cy.visit('/');
  });

  test('Должен произойти создание заказа и сброс конструктора', () => {
    cy.get('[data-testid="ingredient-bun"]')
      .first()
      .drag('[data-testid="constructor-dropzone"]');
    cy.get('[data-testid="ingredient-main"]')
      .first()
      .drag('[data-testid="constructor-dropzone"]');
    cy.get('button').contains('Оформить заказ').click();
    cy.wait('@createOrder').then(() => {
      cy.get('[data-testid="order-number"]').should('contain', '12345');
      cy.get('[data-testid="modal-close"]').click();
      cy.get('[data-testid="constructor-bun"]').should('not.exist');
      cy.get('[data-testid="constructor-filling"]').should('not.exist');
    });
  });
});
