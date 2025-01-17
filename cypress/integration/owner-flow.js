describe("Owner flow", function () {
  before(() => {
    cy.request("POST", `${Cypress.env("api_host")}/reloadDB`);
  });

  it("logs in, replies to review, adds new restaurant", function () {
    cy.visit(Cypress.env("app_host"));

    // redirected to login page as no token
    cy.findAllByText("Login");

    cy.findByLabelText("Username").type("another-owner");
    cy.findByLabelText("Password").type("another-password");
    cy.findByRole("button", { name: "Login" }).click();

    // now on owner home page
    cy.findAllByText("Your Restaurants");
    // see own restaurant
    cy.findByText("Steak House");
    cy.findAllByText("Reply").eq(0).click();

    cy.findByLabelText("Reply").type("new cypress reply");
    cy.findByRole("button", { name: "Reply" }).click();

    // now create a restaurant
    cy.findByRole("button", { name: "Create new restaurant" }).click();
    cy.findByLabelText("Name").type("new cypress restaurant");
    cy.findByRole("button", { name: "Create restaurant" }).click();

    cy.findByText("new cypress restaurant");
  });
});
