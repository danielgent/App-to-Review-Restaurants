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

    // now on user home page
    cy.findAllByText("View all restaurants");
    // should see two results and the average rating
    cy.findByText("Owner's Diner");
    cy.findByText("Steak House");

    cy.findByTestId("rating-4").click();
    cy.findByText("Owner's Diner");
    cy.findByText("Steak House").should("not.exist");

    cy.findByTestId("rating-5").click();
    cy.findByText("no results");

    cy.findByText("& unrated").click();

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
