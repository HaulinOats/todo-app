describe("Auth functionality", () => {
  it("ensure todo-list isn't accessible until logged in", () => {
    cy.visit("/todo-list").get("[data-test-id='inaccessible']").should("exist");
  });

  it("check if sign-in button is accessible", () => {
    cy.get("[data-test-id='sign_in']").should("exist");
  });
  it("Able to access OAuth login screen for GitHub", () => {
    cy.get("[data-test-id='sign_in']").click();
    cy.get("form")
      .invoke("attr", "action")
      .should("contain", "api/auth/signin/github");
  });
});
