describe("User flow", function () {
  it("logs in, CRUDs", function () {
    cy.visit(Cypress.env("app_host"));

    // redirected to login page as no token
    cy.findAllByText("Login");

    cy.findByLabelText("Username").type("admin");
    cy.findByLabelText("Password").type("admin");
    cy.findByRole("button", { name: "Login" }).click();

    // now on user home page
    cy.findAllByText("View all restaurants");

    // user CRUD
    // delete an owner
    cy.findByRole("link", { name: "View all users" }).click();

    cy.findByText("View users");

    // delete first owner user
    cy.findByText("another-owner@example.com");
    cy.findAllByRole("button", { name: "Delete user" }).eq(1).click();
    cy.findByText(
      "Are you sure you want to delete this user another-owner? Will also delete all user's restaurants and reviews"
    );
    cy.findByRole("button", { name: "Confirm" }).click();
    cy.findByText("another-owner@example.com").should("not.exist");

    // edit b-user username
    cy.findByText("b-user");
    cy.findAllByRole("button", { name: "Edit user" }).eq(2).click();
    cy.findByLabelText("Enter a username")
      .should("have.value", "b-user")
      .clear()
      .type("cypress new username");
    cy.findByRole("button", { name: "Update User" }).click();
    cy.findByText("b-user").should("not.exist");
    cy.findByText("cypress new username");

    // restaurant
    // note owners restaurants gone

    // reviews CRUD
    // note reviews? meh
  });
});
