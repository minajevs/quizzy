
function logout() {
    const logoutSelector = 'button[data-test=logout]'
    if (Cypress.$(logoutSelector).length > 0) {
        cy.log('exists')
        cy.get(logoutSelector).then(btn => {
            if (btn) btn.click()
        })
    } else {
        cy.log('notexists')
    }
}

function login() {
    const loginSelector = 'button[data-test=login]'
    if (Cypress.$(loginSelector).length <= 0) return

    // Go to loginpage
    cy.get(loginSelector).click()
    cy.contains('Sign in with Google')
    cy.contains('Sign in with email').click()

    // Login with mail
    cy.get('input[name=email]').type('cypress@example.com')
    cy.get('button[type=submit]').click()

    cy.get('input[name=password]').type('GKUg@v7keDDmqv6')
    cy.get('button[type=submit]').click()

    cy.contains('Logged in', { timeout: 5000 })
}

function getTest(selector) {
    return cy.get(`[data-test="${selector}"]`)
}

function getTestInput(selector) {
    return cy.get(`[data-test="${selector}"] input`)
}

Cypress.Commands.add('logout', logout)
Cypress.Commands.add('login', login)
Cypress.Commands.add('getTest', getTest)
Cypress.Commands.add('getTestInput', getTestInput)
