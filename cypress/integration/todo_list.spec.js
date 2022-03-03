describe("Test Todo List", () => {
  it("Seed db", () => {
    cy.task("db:teardown");
    cy.task("db:seed");
  });

  it("Successfully loads todo list page", () => {
    cy.visit("/todo-list");
  });

  it("Can select different users", () => {
    cy.get('[data-test-id="change_user_select"]').select(1).should("exist");
  });

  it("Enter new todos and submit", () => {
    cy.get('[data-test-id="new_todo_input"]')
      .type("New Todo 1{enter}")
      .wait(250)
      .type("New Todo 2{enter}")
      .wait(250)
      .type("New Todo 3{enter}")
      .wait(250);
  });

  it("Check that Clear Completed works", () => {
    cy.get('[data-test-id="todo_item_toggle"]').eq(0).check({ force: true });

    cy.get(`[data-test-id="clear_completed"]`).click();

    //verify there are no items that are completed
    cy.get(`[data-test-id="todo_item_toggle"]:checked`).should("not.exist");
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
