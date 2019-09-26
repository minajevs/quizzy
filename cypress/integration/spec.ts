
var firebaseui = require('firebaseui')
var firebase = require('firebase')

const settings = {
    teamKey: 'cypress-test-team',
    teamName: 'TEST TEAM',
    nonExistingTeamKey: 'cypress-non-existing-team'
}

const config = {
    apiKey: "AIzaSyBxqTkwT_BM87TefrBgGL5DqIFdnGPupr4",
    authDomain: "quizzy-2ba94.firebaseapp.com",
    databaseURL: "https://quizzy-2ba94.firebaseio.com",
    projectId: "quizzy-2ba94",
    storageBucket: "quizzy-2ba94.appspot.com",
    messagingSenderId: "998358783561"
}

const clearDb = () => {
    const app = firebase.initializeApp(config)
    const database = app.database()
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
        cy.get('[data-test=validation-error]').each(x => cy.wrap(x).should('not.be.visible'))

        cy.get('[data-test=create]').click()

        cy.get('[data-test=validation-error]').within(() => {
            cy.contains('Key can\'t be empty!').should('be.visible')
            cy.contains('Name can\'t be empty!').should('be.visible')
        })

        // Check create operation
        cy.get('[data-test=new-team-id] input').type(settings.teamKey)
        cy.get('[data-test=new-team-name] input').type(settings.teamName)
        cy.get('[data-test=validation-error]').each(x => cy.wrap(x).should('not.be.visible'))

        cy.get('[data-test=create]').click()

        cy.contains(settings.teamName)
        cy.contains('No questions yet')
    })

    it('Can join a team', () => {
        cy.visit('/')
        cy.contains('Welcome!', { timeout: 5000 })
        cy.login()

        cy.contains('Enter yours team id')

        // Check validations
        cy.get('[data-test=validation-error]').each(x => cy.wrap(x).should('not.be.visible'))

        cy.get('[data-test=join]').click()

        cy.get('[data-test=validation-error]').within(() => {
            cy.contains('Please enter an id!').should('be.visible')
        })

        // Check join operation
        cy.get('[data-test=join-team-id] input').type(settings.teamKey)
        cy.get('[data-test=validation-error]').each(x => cy.wrap(x).should('not.be.visible'))

        cy.get('[data-test=join]').click()

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

        cy.get('[data-test=join-team-id] input').type(settings.nonExistingTeamKey)
        cy.get('[data-test=join]').click()

        cy.contains(`Team with key '${settings.nonExistingTeamKey}' was not found!`)
    })

    it('Can\'t join non-existing team by URL', () => {
        cy.visit(`/t/${settings.nonExistingTeamKey}`)
        cy.contains(`Team with key '${settings.nonExistingTeamKey}' was not found!`, { timeout: 5000 })
    })
})

