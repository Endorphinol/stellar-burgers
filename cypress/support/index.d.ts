declare namespace Cypress {
  interface Chainable {
    intercept(method: string, url: string, response?: any): Chainable;
  }
}
