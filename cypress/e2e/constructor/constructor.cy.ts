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
      // 1. Проверяем что булки загрузились
      cy.get('[data-testid="ingredient-bun"]')
        .should('have.length.at.least', 2)
        .first()
        .then(($bun) => {
          const bunName = $bun.find('[data-testid="ingredient-name"]').text();

          // 2. Подготавливаем данные для drag-and-drop
          const ingredient = {
            _id: $bun.data('ingredient')._id,
            type: 'bun',
            name: bunName,
            price: $bun.data('ingredient').price,
            image: $bun.data('ingredient').image
          };

          const dataTransfer = new DataTransfer();
          dataTransfer.setData('ingredient', JSON.stringify(ingredient));

          // 3. Перетаскиваем булку
          cy.wrap($bun).trigger('dragstart', { dataTransfer, force: true });

          cy.get('[data-testid="constructor-dropzone"]')
            .trigger('dragover', { force: true })
            .trigger('drop', { dataTransfer, force: true })
            .trigger('dragend', { force: true });

          // 4. Даём время на обработку
          cy.wait(500);

          // 5. Проверяем верхнюю булку
          cy.get('[data-testid="constructor-bun-top-element"]')
            .should('exist')
            .within(() => {
              // Универсальная проверка без привязки к классу
              cy.contains(bunName).should('exist');
              cy.contains('(верх)').should('exist');
            });

          // 6. Проверяем нижнюю булку
          cy.get('[data-testid="constructor-bun-bottom-element"]')
            .should('exist')
            .within(() => {
              cy.contains(bunName).should('exist');
              cy.contains('(низ)').should('exist');
            });
        });
    });
  });
});
