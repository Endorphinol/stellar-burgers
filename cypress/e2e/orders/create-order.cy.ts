describe('Создание заказа', () => {
  beforeEach(() => {
    // Мокаем все необходимые запросы
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    // Устанавливаем авторизацию
    cy.setCookie('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  it('Должен создавать заказ', () => {
    const dataTransfer = new DataTransfer();

    // Добавляем булку
    cy.get('[data-testid="ingredient-bun"]').first().as('bun');
    cy.get('@bun').trigger('dragstart', { dataTransfer });
    cy.get('[data-testid="constructor-dropzone"]')
      .trigger('drop', { dataTransfer })
      .trigger('dragend');

    // Проверяем булки
    cy.get('[data-testid="constructor-bun-top-element"]').should('exist');
    cy.get('[data-testid="constructor-bun-bottom-element"]').should('exist');

    // Оформляем заказ
    cy.get('[data-testid="order-button"]').should('be.enabled').click();

    // Проверяем модальное окно
    cy.get('[data-testid="order-modal"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain', '12345');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="order-modal"]').should('not.exist');

    // Проверяем очистку конструктора
    cy.get('[data-testid="constructor-bun-top-element"]').should('not.exist');
  });
});
