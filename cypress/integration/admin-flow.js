describe("Admin flow", function () {
  before(() => {
    cy.request("POST", `${Cypress.env("api_host")}/reloadDB`);
  });

  it("has reviews CRUD", function () {
    cy.visit(Cypress.env("app_host"));

    cy.findByLabelText("Username").type("admin");
    cy.findByLabelText("Password").type("admin");
    cy.findByRole("button", { name: "Login" }).click();

    // restaurant CRUD
    cy.findByRole("link", { name: "View all reviews" }).click();

    // delete review
    cy.findByText(/Thanks for your very fast response/);
    cy.findAllByRole("button", { name: "Delete" }).eq(1).click();
    cy.findByText("Are you sure you want to delete this review?");
    cy.findByRole("button", { name: "Confirm" }).click();
    cy.findByRole("progressbar");
    cy.findByRole("progressbar").should("not.exist");
    cy.findByText(/Thanks for your very fast response/).should("not.exist");

    // edit review name
    cy.findByText("More or less");
    cy.findAllByRole("button", { name: "Edit" }).eq(3).click();
    cy.findByLabelText("Comment")
      .should("have.value", "More or less")
      .clear()
      .type("cypress new review text");
    cy.findByRole("button", { name: "Update Review" }).click();
    cy.findByText("More or less").should("not.exist");
    cy.findByText("cypress new review text");
  });

  it("has restaurant CRUD", function () {
    cy.visit(Cypress.env("app_host"));

    cy.findByLabelText("Username").type("admin");
    cy.findByLabelText("Password").type("admin");
    cy.findByRole("button", { name: "Login" }).click();

    // restaurant CRUD
    cy.findByRole("link", { name: "View all restaurants" }).click();

    // delete restaurant
    cy.findByText("Blue Eyed Panda");
    cy.findAllByRole("button", { name: "Delete restaurant" }).eq(0).click();
    cy.findByText(/Are you sure you want to delete Blue Eyed Panda?/);
    cy.findByRole("button", { name: "Confirm" }).click();
    cy.findByRole("progressbar");
    cy.findByRole("progressbar").should("not.exist");
    cy.findByText("Blue Eyed Panda").should("not.exist");

    // edit restaurant name
    cy.findByText("One Plus Restaurant");
    cy.findAllByRole("button", { name: "Edit restaurant" }).eq(0).click();
    cy.findByLabelText("Name")
      .should("have.value", "One Plus Restaurant")
      .clear()
      .type("cypress new restaurant name");
    cy.findByRole("button", { name: "Update restaurant" }).click();
    cy.findByRole("progressbar");
    cy.findByRole("progressbar").should("not.exist");
    cy.findByText("One Plus Restaurant").should("not.exist");
    cy.findByText("cypress new restaurant name");
  });

  it("has user CRUD", function () {
    cy.visit(Cypress.env("app_host"));

    // redirected to login page as no token
    cy.findAllByText("Login");

    cy.findByLabelText("Username").type("admin");
    cy.findByLabelText("Password").type("admin");
    cy.findByRole("button", { name: "Login" }).click();

    // now on user home page
    cy.findAllByText("View all restaurants");

    // user CRUD
    cy.findByRole("link", { name: "View all users" }).click();

    cy.findByText("View users");

    // delete first owner user
    cy.findByText("another-owner@example.com");
    cy.findAllByRole("button", { name: "Delete" }).eq(1).click();
    cy.findByText(
      "Are you sure you want to delete this user another-owner? Will also delete all user's restaurants and reviews"
    );
    cy.findByRole("button", { name: "Confirm" }).click();
    cy.findByRole("progressbar");
    cy.findByRole("progressbar").should("not.exist");
    cy.findByText("another-owner@example.com").should("not.exist");

    // edit b-user username
    cy.findByText("b-user");
    cy.findAllByRole("button", { name: "Edit" }).eq(2).click();
    cy.findByLabelText("username")
      .should("have.value", "b-user")
      .clear()
      .type("cypress new username");
    cy.findByRole("button", { name: "Update User" }).click();
    cy.findByRole("progressbar");
    cy.findByRole("progressbar").should("not.exist");
    cy.findByText("b-user").should("not.exist");
    cy.findByText("cypress new username");

    // should be one unlocked user
    cy.findByRole("button", { name: "Unlock" }).click();
    cy.findByText("Unlock user").should("not.exist");
  });
});
