describe('Initial App Load', () => {
  it('successfully loads', () => {
    cy.visit('/');
  })

  it('Get todos from server', () => {
    cy.get('[data-test-id="get_todos_btn"]').click()
  })

  it('Enter new todos and submit', () => {
    cy.get('[data-test-id="new_todo_input"]')
      .type('New Todo 1{enter}')
      .type('New Todo 2{enter}')
      .type('New Todo 3{enter}')
  })

  it('Toggle todo completion', () => {
    cy.get('[data-test-id="completed_toggle"]').click({ multiple: true });
    cy.get('[data-test-id="completed_toggle"]').click({ multiple: true });
  })

  it('Edit and submit todo item', () => {
    cy.get('[data-test-id="todo_main_label"]').dblclick()
      .get('[data-test-id="todo_main_label_input"]').type(' updated{enter}')
  })

  it('Delete todo', () => {
    cy.get('[data-test-id="delete_todo"]').eq(0).trigger('click', { force: true })
  })
})