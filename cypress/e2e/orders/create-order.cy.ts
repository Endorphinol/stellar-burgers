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
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  it('Должен создавать заказ', () => {
    // Добавляем булку
    cy.get('[data-testid="ingredient-bun"]')
      .first()
      .then(($bun) => {
        const ingredient = JSON.parse($bun.attr('data-ingredient') || '{}');
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('ingredient', JSON.stringify(ingredient));
        cy.wrap($bun).trigger('dragstart', { dataTransfer });
        cy.get('[data-testid="constructor-dropzone"]')
          .trigger('drop', { dataTransfer })
          .trigger('dragend');
      });

    // Добавляем начинку
    cy.get('[data-testid-type="main"]')
      .first()
      .then(($ingredient) => {
        const ingredient = JSON.parse(
          $ingredient.attr('data-ingredient') || '{}'
        );
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('ingredient', JSON.stringify(ingredient));
        cy.wrap($ingredient).trigger('dragstart', { dataTransfer });
        cy.get('[data-testid="constructor-dropzone"]')
          .trigger('drop', { dataTransfer })
          .trigger('dragend');
      });

    // Проверяем конструктор
    cy.get('[data-testid="constructor-bun-top-element"]').should('exist');
    cy.get('[data-testid="constructor-fillings"]').should('exist');

    // Ждём обновления состояния
    cy.wait(1000);

    // Проверяем, что кнопка активна
    cy.get('[data-testid="order-button"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    // Проверяем запрос
    cy.wait('@createOrder').then((interception) => {
      expect(interception.request.headers['authorization']).to.eq(
        'Bearer test-access-token'
      );
    });

    // Проверяем модальное окно
    cy.get('[data-testid="order-modal"]')
      .should('be.visible')
      .within(() => {
        cy.get('[data-testid="order-number"]').should('contain', '12345');
      });
  });
});
