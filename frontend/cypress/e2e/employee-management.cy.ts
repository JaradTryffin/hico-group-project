describe('Employee Management', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('displays the employee table', () => {
    cy.get('h2').should('contain', 'Employees')
    cy.get('table').should('be.visible')
    cy.get('th').should('contain', 'Employee Number')
    cy.get('th').should('contain', 'First Name')
    cy.get('th').should('contain', 'Last Name')
    cy.get('th').should('contain', 'Salutation')
    cy.get('th').should('contain', 'Profile Color')
  })

  it('allows creating a new employee', () => {
    cy.get('button').contains('Add Employee').click()
    cy.url().should('include', '/employee')

    cy.get('input[name="firstName"]').type('John')
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('button').contains('Selection Salutation').click()
    cy.get('div[role="option"]').contains('Mr').click()

    // Wait for the input to be visible and interactable
    cy.get('input[name="employeeNumber"]').should('be.visible').and('not.be.disabled')
        .type('12345', { force: true })

    cy.get('input[name="grossSalaryPY"]').type('50000')

    // Use force: true for radio button interaction
    cy.get('input[type="radio"][value="BLUE"]').check({ force: true })

    cy.get('button[type="submit"]').click()

    // Add a wait here to ensure the page has time to update
    cy.wait(1000)

    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('table').contains('td', 'John')
    cy.get('table').contains('td', 'Doe')
  })

  it('allows editing an existing employee', () => {
    cy.get('table tbody tr').first().click()
    cy.url().should('include', '/employee/')

    cy.get('input[name="firstName"]').clear().type('Jane')
    cy.get('input[name="lastName"]').clear().type('Smith')

    cy.get('button[type="submit"]').click()

    // Add a wait here to ensure the page has time to update
    cy.wait(1000)

    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('table').contains('td', 'Jane')
    cy.get('table').contains('td', 'Smith')
  })
})