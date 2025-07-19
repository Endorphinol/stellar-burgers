describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.setCookie('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);
  });

  it('Должен добавлять булку в конструктор', () => {
    cy.get('[data-testid^="ingredient-"]').should('have.length.gt', 0);
    cy.get('[data-testid-type="bun"]').as('buns').should('have.length.gt', 0);
    cy.get('@buns').first().as('selectedBun');
    cy.get('@selectedBun').then(($bun) => {
      const bunName = $bun.find('[data-testid="ingredient-name"]').text();
      const dataTransfer = new DataTransfer();

      cy.wrap($bun).trigger('dragstart', { dataTransfer, force: true });

      cy.get('[data-testid="constructor-dropzone"]')
        .trigger('dragover', { force: true })
        .trigger('drop', {
          dataTransfer,
          force: true
        })
        .trigger('dragend', { force: true });

      cy.get('[data-testid="constructor-bun-top-element"]')
        .should('exist')
        .and('contain', bunName)
        .and('contain', '(верх)');

      cy.get('[data-testid="constructor-bun-bottom-element"]')
        .should('exist')
        .and('contain', bunName)
        .and('contain', '(низ)');
    });
  });
});
