describe("User flow", function () {
  before(() => {
    cy.request("POST", `${Cypress.env("api_host")}/reloadDB`);
  });

  it("logs in, filters, adds review", function () {
    cy.visit(Cypress.env("app_host"));

    // redirected to login page as no token
    cy.findAllByText("Login");

    cy.findByLabelText("Username").type("user-no-reviews");
    cy.findByLabelText("Password").type("password-3");
    cy.findByRole("button", { name: "Login" }).click();

    // Test rating filters
    cy.findAllByText("View all restaurants");

    // 4 star restaurant
    cy.findByText("Blue Eyed Panda");
    // 3 star
    cy.findByText("La Casita");

    cy.findByTestId("rating-4").click();
    cy.findByText("Blue Eyed Panda");
    cy.findByText("La Casita").should("not.exist");

    cy.findByTestId("rating-3").click();
    cy.findByText("Blue Eyed Panda");
    cy.findByText("La Casita");

    cy.findByTestId("rating-5").click();
    cy.findByText("no results");

    cy.findByText("& unrated").click();

    // now test pagination

    // on first page
    cy.findByText("Blue Eyed Panda");
    // on second page
    cy.findByText("Wah Ji Wah").should("not.exist");

    // no back button as on first page
    cy.findByText("Previous").should("not.exist");
    cy.findByText("Next").click();

    // now on second page
    cy.findByText("Previous");
    cy.findByText("Next").should("not.exist");
    cy.findByText("Blue Eyed Panda").should("not.exist");
    cy.findByText("Wah Ji Wah");

    // now back to first
    cy.findByText("Previous").click();
    cy.findByText("Previous").should("not.exist");
    cy.findByText("Blue Eyed Panda");
    cy.findByText("Wah Ji Wah").should("not.exist");

    // now go to detail page which is correctly populated
    cy.findByText("Owner's Diner").click();

    // ugly way to assert that 4 stars for restaurant
    cy.findByText("Owner's Diner")
      .closest("div")
      .find('[aria-label="4 Stars"]');

    cy.findByText("Top review")
      .closest("div")
      .contains(/Super website for people like us/);
    cy.findByText("Worst review")
      .closest("div")
      .contains(/I currently don't need any changes, /);

    cy.findByRole("button", { name: "Rate this restaurant" }).click();

    cy.findByLabelText("Comment").type("new cypress review");
    cy.findByLabelText("Rating").contains("1 Star").click();

    cy.findByRole("button", { name: "Create Review" }).click();

    // page should now be updated
    cy.findAllByText(/new cypress review/);
    // review has now gone down
    cy.findByText("Owner's Diner")
      .closest("div")
      .find('[aria-label="3 Stars"]');
    cy.findByText("Worst review")
      .closest("div")
      .contains(/new cypress review/);
  });
});
