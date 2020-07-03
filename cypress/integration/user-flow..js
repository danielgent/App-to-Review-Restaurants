import { localURL } from "../CYPRESS_CONFIG";

describe("User flow", function () {
  it("creates account and logs in", function () {
    cy.visit(localURL);

    // redirected to login page as no token
    cy.findAllByText("Login");

    cy.findByLabelText("Username").type("user-no-reviews");
    cy.findByLabelText("Password").type("password-3");
    cy.findByRole("button", { name: "Login" }).click();

    // now on user home page
    cy.findAllByText("View all restaurants");
    // should see two results and the average rating
    cy.findByText("Owner's Diner");
    cy.findByText("Steak House");

    // TODO - read something that is better UX than this
    // cy.findByText("4");
    // cy.findByText("3");

    cy.findByLabelText("Select minimum average rating").select("4");
    cy.findByText("Owner's Diner");
    cy.findByText("Steak House").should("not.exist");

    cy.findByLabelText("Select maximum average rating").select("3");
    cy.findByText("Owner's Diner").should("not.exist");
    cy.findByText("Steak House");

    cy.findByLabelText("Select minimum average rating").select("5");
    cy.findByText("Owner's Diner").should("not.exist");
    cy.findByText("Steak House").should("not.exist");

    cy.findByRole("button", { name: "Clear filters" }).click();

    // now go to detail page
    cy.findByText("Owner's Diner").click();

    cy.findByText("Top review");
    cy.findByText("Owner's Diner");
  });
});
