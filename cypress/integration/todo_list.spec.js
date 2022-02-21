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

  it("Toggle Select all todos", () => {
    cy.get('[data-test-id="new_todo_selectAll"]').click().click();
  });
});
