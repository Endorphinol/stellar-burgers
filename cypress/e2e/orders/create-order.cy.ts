describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        order: { number: 12345 }
      }
    }).as('createOrder');

    cy.intercept(
      'GET',
      'https://norma.nomoreparties.space/api/auth/user',
      (req) => {
        const token = req.headers['authorization'];
        if (token && token.includes('fake-access-token')) {
          req.reply({
            statusCode: 200,
            body: {
              success: true,
              user: {
                email: 'test@test.com',
                name: 'Test User'
              }
            }
          });
        } else {
          req.reply({ statusCode: 403 });
        }
      }
    ).as('getUser');

    cy.intercept(
      'POST',
      'https://norma.nomoreparties.space/api/auth/token',
      (req) => {
        const { token } = req.body;
        if (token === 'fake-refresh-token') {
          req.reply({
            statusCode: 200,
            body: {
              success: true,
              accessToken: 'new-fake-access-token',
              refreshToken: 'new-fake-refresh-token'
            }
          });
        } else {
          req.reply({ statusCode: 401 });
        }
      }
    ).as('refreshToken');

    window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    cy.setCookie('accessToken', 'fake-access-token');

    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);
  });

  afterEach(() => {
    window.localStorage.removeItem('refreshToken');
    cy.clearCookies();
  });

  it('Должен создавать заказ и сбрасывать конструктор', () => {
    cy.get('[data-testid="ingredient-item"]').should('have.length.gt', 0);

    cy.get('[data-testid="ingredient-bun"]').first().trigger('dragstart');
    cy.get('[data-testid="constructor-dropzone"]')
      .trigger('drop')
      .trigger('dragend');

    cy.get('[data-testid="ingredient-main"]').first().trigger('dragstart');
    cy.get('[data-testid="constructor-dropzone"]')
      .trigger('drop')
      .trigger('dragend');

    cy.get('[data-testid="constructor-bun"]').should('exist');
    cy.get('[data-testid="constructor-filling"]').should('exist');

    cy.get('button').contains('Оформить заказ').click();

    cy.wait('@createOrder');
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain', '12345');

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    cy.get('[data-testid="constructor-bun"]').should('not.exist');
    cy.get('[data-testid="constructor-filling"]').should('not.exist');
  });
});
