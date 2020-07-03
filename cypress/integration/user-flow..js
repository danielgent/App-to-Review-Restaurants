describe("User flow", function () {
  it("logs in, filters, adds review", function () {
    cy.visit(Cypress.env("app_host"));

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

    // now go to detail page which is correctly populated
    cy.findByText("Owner's Diner").click();

    // TODO - ugly. better component and style and then assert
    cy.findByText("Avg 4");

    cy.findByText("Top review")
      .closest("div")
      .contains(/Super website for people like us/);
    cy.findByText("Worst review")
      .closest("div")
      .contains(/I currently don't need any changes, /);

    cy.findByRole("button", { name: "Rate this restaurant" }).click();

    cy.findByLabelText("Comment").type("new cypress review");
    cy.findByLabelText("Rating").select("1");
    cy.findByRole("button", { name: "Create Review" }).click();

    // page should now be updated
    cy.findAllByText(/new cypress review/);

    cy.findByText("Avg 3");
    cy.findByText("Worst review")
      .closest("div")
      .contains(/new cypress review/);
  });
});
