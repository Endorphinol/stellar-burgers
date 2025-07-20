describe('Создание заказа', () => {
  beforeEach(() => {
    // Мокируем API и устанавливаем тестовые данные
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
    // Добавляем булку (верх)
    cy.get('[data-testid="ingredient-bun"]')
      .first()
      .within(() => {
        cy.get('[data-testid="ingredient-add-container"]').click();
      });

    // Добавляем начинку
    cy.get('[data-testid="ingredient-main"]')
      .first()
      .within(() => {
        cy.get('[data-testid="ingredient-add-container"]').click();
      });

    // Мокаем создание заказа
    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: { success: true, name: 'Тестовый бургер', order: { number: 12345 } }
    }).as('createOrder');

    // Оформляем заказ
    cy.get('[data-testid="order-button"]').should('not.be.disabled').click();

    // Проверяем модальное окно
    cy.get('[data-testid="order-modal"]').should('exist');
    cy.get('[data-testid="order-number"]').should('contain', '12345');

    // Проверяем очистку конструктора
    cy.get('[data-testid="constructor-bun-top-element"]').should(
      'contain',
      'Выберите булки'
    );
    cy.get('[data-testid="constructor-fillings"]').should(
      'contain',
      'Выберите начинку'
    );
  });

  it('Должен перенаправлять на логин при попытке создать заказ без авторизации', () => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
    cy.intercept('GET', '**/api/auth/user', { statusCode: 401 });

    // Добавляем булку (верх)
    cy.get('[data-testid="ingredient-bun"]')
      .first()
      .within(() => {
        cy.get('[data-testid="ingredient-add-container"]').click();
      });

    // Добавляем начинку
    cy.get('[data-testid="ingredient-main"]')
      .first()
      .within(() => {
        cy.get('[data-testid="ingredient-add-container"]').click();
      });

    cy.get('[data-testid="order-button"]').click();
    cy.location('pathname').should('eq', '/login');
  });
});
