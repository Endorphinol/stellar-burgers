describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json',
      statusCode: 200
    }).as('createOrder');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.setCookie('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);
  });

  it('Должен создавать заказ', () => {
    // Добавляем булку
    cy.get('[data-testid-type="bun"]')
      .first()
      .then(($el) => {
        const dataTransfer = new DataTransfer();
        const ingredient = JSON.parse($el.attr('data-ingredient') || '{}');
        dataTransfer.setData('ingredient', JSON.stringify(ingredient));

        cy.wrap($el).trigger('dragstart', { dataTransfer });
        cy.get('[data-testid="constructor-dropzone"]')
          .trigger('drop', { dataTransfer })
          .trigger('dragend');
      });

    // Добавляем начинку
    cy.get('[data-testid-type="main"]')
      .first()
      .then(($el) => {
        const dataTransfer = new DataTransfer();
        const ingredient = JSON.parse($el.attr('data-ingredient') || '{}');
        dataTransfer.setData('ingredient', JSON.stringify(ingredient));

        cy.wrap($el).trigger('dragstart', { dataTransfer });
        cy.get('[data-testid="constructor-dropzone"]')
          .trigger('drop', { dataTransfer })
          .trigger('dragend');
      });

    // Оформляем заказ
    cy.get('[data-testid="order-button"]').should('not.be.disabled').click();

    // Проверяем модальное окно
    cy.get('[data-testid="order-modal"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain', '12345');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="order-modal"]').should('not.exist');
  });
});
