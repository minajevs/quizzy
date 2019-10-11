
var firebaseui = require('firebaseui')
var firebase = require('firebase')

const settings = {
    teamKey: 'cypress-test-team',
    teamName: 'TEST TEAM',
    nonExistingTeamKey: 'cypress-non-existing-team',

    // members
    newUserNameAndEmail: ['New User 1', 'email@example.com'],
}

const config = {
    apiKey: "AIzaSyBxqTkwT_BM87TefrBgGL5DqIFdnGPupr4",
    authDomain: "quizzy-2ba94.firebaseapp.com",
    databaseURL: "https://quizzy-2ba94.firebaseio.com",
    projectId: "quizzy-2ba94",
    storageBucket: "quizzy-2ba94.appspot.com",
    messagingSenderId: "998358783561"
}

const app = firebase.initializeApp(config)
const database = app.database()

const clearDb = () => {
    database.ref(`teams/${settings.teamKey}`).remove()
    database.ref(`members/${settings.teamKey}`).remove()
    database.ref(`answers/${settings.teamKey}`).remove()
    database.ref(`questions/${settings.teamKey}`).remove()
}

describe('The Main Page', () => {
    before(() => {
        clearDb()
    })

    it('Frontpage is correct', () => {
        cy.visit('/')
        cy.contains('Welcome!', { timeout: 5000 })
        cy.logout()

        cy.contains('Not logged in')
        cy.contains('log in to create a new team')
        cy.contains('Enter yours team id:')
        cy.contains('Login')
    })

    it('Can Log In', () => {
        cy.visit('/')
        cy.contains('Welcome!', { timeout: 5000 })
        cy.logout()

        cy.login()

        cy.contains('Cypress Test')
    })

    it('Can create a team', () => {
        cy.visit('/')
        cy.contains('Welcome!', { timeout: 5000 })
        cy.login()

        cy.contains('New team id')
        cy.contains('New team name')

        // Check validations
        cy.getTest('validation-error').each(x => cy.wrap(x).should('not.be.visible'))

        cy.getTest('create').click()

        cy.getTest('validation-error').within(() => {
            cy.contains('Key can\'t be empty!').should('be.visible')
            cy.contains('Name can\'t be empty!').should('be.visible')
        })

        // Check create operation
        cy.getTestInput('new-team-id').type(settings.teamKey)
        cy.getTestInput('new-team-name').type(settings.teamName)
        cy.getTest('validation-error').each(x => cy.wrap(x).should('not.be.visible'))

        cy.getTest('create').click()

        cy.contains(settings.teamName)
        cy.contains('No questions yet')
    })

    it('Can join a team', () => {
        cy.visit('/')
        cy.contains('Welcome!', { timeout: 5000 })
        cy.login()

        cy.contains('Enter yours team id')

        // Check validations
        cy.getTest('validation-error').each(x => cy.wrap(x).should('not.be.visible'))

        cy.getTest('join').click()

        cy.getTest('validation-error').within(() => {
            cy.contains('Please enter an id!').should('be.visible')
        })

        // Check join operation
        cy.getTestInput('join-team-id').type(settings.teamKey)
        cy.getTest('validation-error').each(x => cy.wrap(x).should('not.be.visible'))

        cy.getTest('join').click()

        cy.contains(settings.teamName)
        cy.contains('No questions yet')
    })

    it('Can join a team by URL', () => {
        cy.visit(`/t/${settings.teamKey}`)
        cy.contains(settings.teamName, { timeout: 5000 })
        cy.contains('No questions yet', { timeout: 5000 })
    })

    it('Can\'t join non-existing team', () => {
        cy.visit('/')
        cy.contains('Welcome!', { timeout: 5000 })
        cy.contains('Enter yours team id')

        cy.getTestInput('join-team-id').type(settings.nonExistingTeamKey)
        cy.getTest('join').click()

        cy.contains(`Team with key '${settings.nonExistingTeamKey}' was not found!`)
    })

    it('Can\'t join non-existing team by URL', () => {
        cy.visit(`/t/${settings.nonExistingTeamKey}`)
        cy.contains(`Team with key '${settings.nonExistingTeamKey}' was not found!`, { timeout: 5000 })
    })
})

describe('The Team Page', () => {
    before(() => {
        // clear db
        clearDb()
        // init a team
        cy.visit('/')
        cy.contains('Welcome!', { timeout: 5000 })
        cy.login()

        cy.getTestInput('new-team-id').type(settings.teamKey)
        cy.getTestInput('new-team-name').type(settings.teamName)
        cy.getTest('create').click()
    })

    beforeEach(() => {
        cy.visit(`/t/${settings.teamKey}`)
        cy.contains(settings.teamName, { timeout: 5000 })
    })

    describe('Members', () => {
        it('Can add a new member', () => {
            cy.contains('Add member').click()
            cy.contains('New member')

            // Check validations
            cy.getTest('validation-error').each(x => cy.wrap(x).should('not.be.visible'))

            cy.getTest('add-member').click()

            cy.getTest('validation-error').within(() => {
                cy.contains('Member name can\'t be empty!').should('be.visible')
            })

            // Actually check creation
            cy.getTestInput('add-member-name').type(settings.newUserNameAndEmail[0])
            cy.getTestInput('add-member-email').type(settings.newUserNameAndEmail[1])

            cy.getTest('add-member').click()

            // Verify
            cy.getTest('member-section').contains(settings.newUserNameAndEmail[0])
        })

        it('Can edit a member', () => {
            cy.contains(settings.newUserNameAndEmail[0]).click()
            cy.contains('Edit')

            // Check validations
            cy.getTest('validation-error').each(x => cy.wrap(x).should('not.be.visible'))

            cy.getTestInput('edit-member-name').clear()
            cy.getTestInput('edit-member-email').clear()

            cy.getTest('save-member').click()

            cy.getTest('validation-error').within(() => {
                cy.contains('Member name can\'t be empty!').should('be.visible')
            })

            // Actually check creation
            cy.getTestInput('edit-member-name').type(settings.newUserNameAndEmail[0] + ' new')
            cy.getTestInput('edit-member-email').type(settings.newUserNameAndEmail[1] + ' new')

            cy.getTest('save-member').click()

            // Verify
            cy.getTest('member-section').contains(settings.newUserNameAndEmail[0] + ' new')
        })
    })
})
