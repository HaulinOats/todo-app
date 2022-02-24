// These tests won't work without authorized login. How is this handled with Cypress?

describe("Initial App Load", () => {
  it("successfully loads", () => {
    cy.visit("/todo-list");
  });

  it("Enter new todos and submit", () => {
    cy.get('[data-test-id="new_todo_input"]')
      .type("New Todo 1{enter}")
      .type("New Todo 2{enter}")
      .type("New Todo 3{enter}");
  });

  it("Check that Clear Completed works", () => {
    //check first todo item that was just created
    cy.get('[data-test-id="todo_item_toggle"]').eq(0).check();

    cy.get(`[data-test-id="todo_item"]`)
      .find('input[type="checkbox"]')
      .should("not.be.checked")
      .check();

    cy.get(`[data-test-id="clear_completed"]`).click();

    //verify there are no items that are completed
    cy.url("todo-list?filter=all")
      .get(`[data-test-id="todo_item"]`)
      .find('input[type="checkbox"]')
      .should("not.exist");
  });

  it("Toggle todo completion", () => {
    cy.get('[data-test-id="completed_toggle"]')
      .click({ multiple: true })
      .click({ multiple: true });
  });

  it("Edit and submit todo item", () => {
    cy.get('[data-test-id="todo_main_label"]').dblclick();
    cy.get('[data-test-id="todo_main_label_input"]').type(" updated{enter}");
  });

  it("Delete todo", () => {
    // Forced due to the delete icon being applied on CSS hover event
    cy.get('[data-test-id="delete_todo"]')
      .eq(0)
      .trigger("click", { force: true });
  });

  it("Check filter views work", () => {
    const filters = ["all", "active", "completed"];
    filters.forEach((filter) => {
      cy.get(`[data-test-id="filter_link_${filter}"]`).click();
      cy.url().should("include", `?filter=${filter}`);
    });
  });

  it("Toggle Select all todos", () => {
    cy.get('[data-test-id="new_todo_selectAll"]').click().click();
  });
});
