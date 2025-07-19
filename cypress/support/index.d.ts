declare namespace Cypress {
  interface Chainable {
    intercept(method: string, url: string | RegExp, response?: any): Chainable;
  }
}
