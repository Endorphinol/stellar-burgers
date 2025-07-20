describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' });

    cy.setCookie('accessToken', 'test-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('Должен открывать модальное окно с деталями ингредиента', () => {
    cy.get('[data-testid^="ingredient-"]').first().click();
    cy.get('[data-testid="ingredient-details"]').should('exist');
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="ingredient-details"]').should('not.exist');
  });

  it('Должен создавать заказ с булкой и начинкой', () => {
    // Мокаем успешный ответ API для создания заказа
    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Тестовый бургер',
        order: { number: 12345 }
      }
    }).as('createOrder');

    // Добавляем булку в конструктор
    cy.get('[data-testid="ingredient-bun"]')
      .first()
      .within(() => {
        cy.get('[data-testid="ingredient-add-container"]').click();
      });

    // Добавляем начинку в конструктор
    cy.get('[data-testid="ingredient-main"]')
      .first()
      .within(() => {
        cy.get('[data-testid="ingredient-add-container"]').click();
      });

    // Ждем обновления состояния
    cy.wait(500);

    // Проверяем конструктор
    cy.get('[data-testid="constructor-bun-top-element"]').should('exist');
    cy.get('[data-testid="constructor-fillings"]').should('exist');

    // Дополнительная проверка - убедимся что начинка действительно добавилась
    cy.get('[data-testid^="constructor-filling"]').should('exist');

    // Проверяем кнопку
    cy.get('[data-testid="order-button"]')
      .should('not.be.disabled')
      .and('contain', 'Оформить заказ');

    // Оформляем заказ
    cy.get('[data-testid="order-button"]').click();

    // Проверяем модальное окно
    cy.get('[data-testid="order-modal"]').should('exist');
    cy.get('[data-testid="order-number"]').should('contain', '12345');
  });

  it('Должен перенаправлять на логин при попытке создать заказ без авторизации', () => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
    cy.intercept('GET', '**/api/auth/user', { statusCode: 401 });

    cy.get('[data-testid="ingredient-bun"]')
      .first()
      .within(() => {
        cy.get('[data-testid="ingredient-add-container"]').click();
      });

    cy.get('[data-testid="ingredient-main"]')
      .first()
      .within(() => {
        cy.get('[data-testid="ingredient-add-container"]').click();
      });

    cy.get('[data-testid="order-button"]').click();
    cy.location('pathname').should('eq', '/login');
  });
});
