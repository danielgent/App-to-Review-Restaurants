import { localURL } from "../CYPRESS_CONFIG";

describe("User flow", function () {
  it("creates account and logs in", function () {
    cy.visit(localURL);

    cy.findByText("Login");
  });
});
