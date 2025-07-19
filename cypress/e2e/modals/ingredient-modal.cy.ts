describe('Тестирование модального окна ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

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

    cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/token', {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'new-fake-access-token',
        refreshToken: 'new-fake-refresh-token'
      }
    }).as('refreshToken');

    window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    cy.setCookie('accessToken', 'fake-access-token');

    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);
    cy.get('[data-testid="ingredient-list"]').should('be.visible');
  });

  afterEach(() => {
    window.localStorage.removeItem('refreshToken');
    cy.clearCookies();
  });

  it('Должно открываться и закрываться по клику на крестик', () => {
    cy.get('[data-testid="ingredient-item"]').first().click();
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="ingredient-details-name"]').should('exist');
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });
});
