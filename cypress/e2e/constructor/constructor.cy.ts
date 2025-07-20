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
    // Проверяем что ингредиенты загрузились
    cy.get('[data-testid^="ingredient-"]').should('have.length.at.least', 2);

    // Находим первую булку
    cy.get('[data-testid-type="bun"]').first().as('bun');

    // Добавляем булку через drag-and-drop (так как кнопка может быть скрыта)
    cy.get('@bun').then(($el) => {
      const dataTransfer = new DataTransfer();
      const ingredient = JSON.parse($el.attr('data-ingredient') || '{}');
      dataTransfer.setData('ingredient', JSON.stringify(ingredient));

      cy.wrap($el).trigger('dragstart', { dataTransfer });
      cy.get('[data-testid="constructor-dropzone"]')
        .trigger('drop', { dataTransfer })
        .trigger('dragend');
    });

    // Проверяем что булка добавлена
    cy.get('[data-testid="constructor-bun-top-element"]').should('exist');
    cy.get('[data-testid="constructor-bun-bottom-element"]').should('exist');
  });
});
