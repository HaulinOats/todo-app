import styles from '../../styles/TodoList.module.css';

describe('Initial App Load', () => {
  it('successfully loads', () => {
    cy.visit('/');
  })

  it('Get todos from server', () => {
    // seed a post in the DB that we control from our tests
    cy.request('/api/getTodos');
  })

  it('Add a todo item', () => {
    cy.get(styles.new_todo_input).type('New Todo')
  })
})