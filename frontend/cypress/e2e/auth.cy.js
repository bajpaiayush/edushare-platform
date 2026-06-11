describe('Authentication Black Box Tests', () => {
  beforeEach(() => {
    // Navigate to the app before each test
    // Assuming React app runs on port 3000
    cy.visit('/');
  });

  it('TC-01: Should prevent login when fields are completely empty', () => {
    // Click login without typing anything
    cy.get('button[type="submit"]').click();
    
    // Check if the HTML5 validation kicks in (the form should not submit)
    cy.get('input[type="email"]').invoke('prop', 'validationMessage')
      .should('not.be.empty');
  });

  it('TC-02: Should show error message with invalid login credentials', () => {
    cy.get('input[type="email"]').type('invalid@test.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Verify that the error message shows up on screen
    cy.get('.error-msg').should('be.visible');
  });

  it('TC-03: Should allow navigation to the registration page', () => {
    cy.contains('Register here').click();
    
    // Verify we are on the register page
    cy.contains('Create Account').should('be.visible');
    cy.get('input[placeholder="Your full name"]').should('be.visible');
  });

  it('TC-04: Should show validation error when passwords are empty in register form', () => {
    cy.contains('Register here').click();
    
    // Fill partial info
    cy.get('input[placeholder="Your full name"]').type('Test User');
    cy.get('input[type="email"]').type('test@user.com');
    
    // Click register
    cy.get('button[type="submit"]').click();
    
    // Check validation on password field
    cy.get('input[type="password"]').invoke('prop', 'validationMessage')
      .should('not.be.empty');
  });
});
