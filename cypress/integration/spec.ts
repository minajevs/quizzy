
var firebaseui = require('firebaseui')
var firebase = require('firebase')

const settings = {
    username: 'Cypress Tests',
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

        cy.contains(settings.username)
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

    it('Can see a team in available team list', () => {
        cy.visit('/')
        cy.contains('Welcome!', { timeout: 5000 })
        cy.login()

        cy.contains('Your teams:')
        cy.contains(settings.teamName, { timeout: 5000 })
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

    it('Can join a team by clicking URL on frontpage', () => {
        cy.visit('/')
        cy.contains('Welcome!', { timeout: 5000 })
        cy.login()

        cy.contains('Your teams:')
        cy.contains(settings.teamName, { timeout: 5000 }).click()

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

        cy.contains(settings.teamName, { timeout: 5000 })
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

    describe('Questions', () => {
        const testMember1 = 'test-member-1'
        const testMember2 = 'test-member-2'
        const testMember3 = 'test-member-3'

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

            cy.contains(settings.teamName, { timeout: 5000 })

            // Add a users for testing questions
            const addMember = (name: string) => {
                cy.contains('Add member').click()
                cy.getTestInput('add-member-name').type(name)
                cy.getTestInput('add-member-email').type(`${name}@example.com`)
                cy.getTest('add-member').click()
                // Verify
                cy.getTest('member-section').contains(name)
            }

            addMember(testMember1)
            addMember(testMember2)
            addMember(testMember3)
        })

        beforeEach(() => {
            cy.visit(`/t/${settings.teamKey}`)
            cy.contains(settings.teamName, { timeout: 5000 })
            cy.contains(testMember1)
            cy.contains(testMember2)
            cy.contains(testMember3)
        })

        it('Can open a new question modal', () => {
            cy.contains('Add Question').click()
            cy.contains('New question')
        })

        it('New question modal lists all the users', () => {
            cy.contains('Add Question').click()
            cy.contains('New question')

            cy.getTest('add-question-dropdown').click()

            cy.getTest('add-question-dropdown').get('.menu').contains(settings.username)
            cy.getTest('add-question-dropdown').contains(testMember1)
            cy.getTest('add-question-dropdown').contains(testMember2)
            cy.getTest('add-question-dropdown').contains(testMember3)
        })

        it('Can add a new question as yourself', () => {
            const testDesc = 'test-desc'
            const testQuest = 'test-quest'

            cy.contains('Add Question').click()
            cy.contains('New question')

            cy.getTest('add-question-dropdown').click()
            cy.getTest('add-question-dropdown').get('.menu').contains(settings.username).click()

            cy.getTest('add-question-description').type(testDesc)
            cy.getTestInput('add-question-question').type(testQuest)

            cy.get('.modal').contains('Add').click()

            cy.contains(testDesc)
            cy.contains(testQuest)

            cy.getTest('answer-row').should('have.length', 3)
            cy.getTest('answer-row').each(x => cy.wrap(x).contains('Exclude'))
            cy.getTest('answer-row').each(x => cy.wrap(x).contains('Save'))
            cy.getTest('answer-row').within(x => {
                cy.contains(testMember1)
                cy.contains(testMember2)
                cy.contains(testMember3)
            })

            cy.getTest('questions-tab').contains('By ' + settings.username)
            cy.getTest('questions-tab').contains(testQuest)
        })

        it('Can add a new question as another member', () => {
            const testDesc = 'test-desc-2'
            const testQuest = 'test-quest-2'

            cy.contains('Add Question').click()
            cy.contains('New question')

            cy.getTest('add-question-dropdown').click()
            cy.getTest('add-question-dropdown').get('.menu').contains(testMember2).click()

            cy.getTest('add-question-description').type(testDesc)
            cy.getTestInput('add-question-question').type(testQuest)

            cy.get('.modal').contains('Add').click()

            cy.contains(testDesc)
            cy.contains(testQuest)

            cy.getTest('answer-row').should('have.length', 1) // Only author can see other questions
            cy.getTest('answer-row').contains('Exclude')
            cy.getTest('answer-row').contains('Save')
            cy.getTest('answer-row').contains(settings.username)

            cy.getTest('questions-tab').contains('By ' + testMember2)
            cy.getTest('questions-tab').contains(testQuest)
        })

        it('Can add a new question with custom units', () => {
            const testDesc = 'test-desc-default-units'
            const testQuest = 'test-quest-default-units'
            const testUnits = 'test-unit'

            cy.contains('Add Question').click()
            cy.contains('New question')

            cy.getTest('add-question-dropdown').click()
            cy.getTest('add-question-dropdown').get('.menu').contains(testMember2).click()

            cy.getTest('add-question-description').type(testDesc)
            cy.getTestInput('add-question-question').type(testQuest)
            cy.getTestInput('add-question-question').type(testQuest)
            cy.getTestInput('question-units').type(testUnits)

            cy.get('.modal').contains('Add').click()

            cy.contains(testDesc)
            cy.contains(testQuest)

            cy.getTest('answer-row').contains(testUnits)
        })

        it('Can view a question details', () => {
            const testDesc = 'test-desc-3'
            const testQuest = 'test-quest-3'

            cy.contains('Add Question').click()
            cy.contains('New question')

            cy.getTest('add-question-dropdown').click()
            cy.getTest('add-question-dropdown').get('.menu').contains(testMember3).click()

            cy.getTest('add-question-description').type(testDesc)
            cy.getTestInput('add-question-question').type(testQuest)

            cy.get('.modal').contains('Add').click()

            cy.getTest('questions-tab').contains('By ' + testMember3)
            cy.getTest('questions-tab').contains(testQuest).click()
            cy.get('.modal').contains('View question')
            cy.get('.modal').contains(testQuest)
            cy.get('.modal').contains(testDesc)
            cy.get('.modal').contains('Edit')
        })

        it('Can edit a question details', () => {
            const testDesc = 'test-desc-4'
            const testQuest = 'test-quest-4'
            const testUnits = 'test-units-4'

            cy.contains('Add Question').click()
            cy.contains('New question')

            cy.getTest('add-question-dropdown').click()
            cy.getTest('add-question-dropdown').get('.menu').contains(testMember3).click()

            cy.getTest('add-question-description').type(testDesc)
            cy.getTestInput('add-question-question').type(testQuest)
            cy.getTestInput('question-units').type(testUnits)

            cy.get('.modal').contains('Add').click()

            cy.getTest('questions-tab').contains('By ' + testMember3)
            cy.getTest('questions-tab').contains(testQuest).click()

            cy.get('.modal').contains('Edit').click()

            cy.getTest('edit-question-description').clear().type(testDesc + ' new')
            cy.getTestInput('edit-question-text').clear().type(testQuest + ' new')
            cy.getTestInput('question-units').clear().type(testUnits + ' new')

            cy.get('.modal').contains('Save').click()

            cy.contains(testDesc + ' new')
            cy.contains(testQuest + ' new')
            cy.contains(testUnits + ' new')

        })
    })

    describe('Answers', () => {
        const testMember1 = 'test-member-1'
        const testMember2 = 'test-member-2'
        const testMember3 = 'test-member-3'

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

            cy.contains(settings.teamName, { timeout: 5000 })

            // Add a users for testing questions
            const addMember = (name: string) => {
                cy.contains('Add member').click()
                cy.getTestInput('add-member-name').type(name)
                cy.getTestInput('add-member-email').type(`${name}@example.com`)
                cy.getTest('add-member').click()
                // Verify
                cy.getTest('member-section').contains(name)
            }

            addMember(testMember1)
            addMember(testMember2)
            addMember(testMember3)
        })

        beforeEach(() => {
            cy.visit(`/t/${settings.teamKey}`)
            cy.contains(settings.teamName, { timeout: 5000 })
            cy.contains(testMember1)
            cy.contains(testMember2)
            cy.contains(testMember3)
        })

        it('Can add a question answer', () => {
            const testDesc = 'test-desc-1'
            const testQuest = 'test-quest-1'

            cy.contains('Add Question').click()
            cy.contains('New question')

            cy.getTest('add-question-dropdown').click()
            cy.getTest('add-question-dropdown').get('.menu').contains(testMember3).click()

            cy.getTest('add-question-description').type(testDesc)
            cy.getTestInput('add-question-question').type(testQuest)

            cy.get('.modal').contains('Add').click()

            cy.getTest('questions-tab').contains('By ' + testMember3)
            cy.getTest('questions-tab').contains(testQuest).click()

            cy.get('.modal').contains('Edit').click()

            cy.get('.modal').within(x => cy.wrap(x).getTestInput('answer-input').type('111'))

            cy.get('.modal').contains('Save').click()

            cy.contains('Answered')
            cy.contains('Difference')
        })

        it('Can add a question answer', () => {
            const testDesc = 'test-desc-1'
            const testQuest = 'test-quest-1'

            cy.contains('Add Question').click()
            cy.contains('New question')

            cy.getTest('add-question-dropdown').click()
            cy.getTest('add-question-dropdown').get('.menu').contains(testMember3).click()

            cy.getTest('add-question-description').type(testDesc)
            cy.getTestInput('add-question-question').type(testQuest)

            cy.get('.modal').contains('Add').click()

            cy.getTest('questions-tab').contains('By ' + testMember3)
            cy.getTest('questions-tab').contains(testQuest).click()

            cy.get('.modal').contains('Edit').click()

            cy.get('.modal').within(x => cy.wrap(x).getTestInput('answer-input').type('111'))

            cy.get('.modal').contains('Save').click()

            cy.contains('Answered')
            cy.contains('Difference')
        })

        it('Can add answers to a running question', () => {
            const testDesc = 'test-desc-2'
            const testQuest = 'test-quest-2'

            cy.contains('Add Question').click()
            cy.contains('New question')

            cy.getTest('add-question-dropdown').click()
            cy.getTest('add-question-dropdown').get('.menu').contains(settings.username).click()

            cy.getTest('add-question-description').type(testDesc)
            cy.getTestInput('add-question-question').type(testQuest)

            cy.get('.modal').contains('Add').click()

            cy.getTest('answer-row').should('have.length', 3)

            cy.getTest('answer-row').eq(0).within(x => {
                cy.getTestInput('answer-input').type('1')
                cy.contains('Save').click()
            })

            cy.getTest('answer-row').eq(0).within(x => {
                cy.contains('answered')
            })
        })

        it('Can exclude a member from a running question', () => {
            const testDesc = 'test-desc-3'
            const testQuest = 'test-quest-3'

            cy.contains('Add Question').click()
            cy.contains('New question')

            cy.getTest('add-question-dropdown').click()
            cy.getTest('add-question-dropdown').get('.menu').contains(settings.username).click()

            cy.getTest('add-question-description').type(testDesc)
            cy.getTestInput('add-question-question').type(testQuest)

            cy.get('.modal').contains('Add').click()

            cy.getTest('answer-row').should('have.length', 3)

            cy.getTest('answer-row').eq(1).within(x => {
                cy.contains('Exclude').click()
            })

            cy.getTest('answer-row').eq(1).within(x => {
                cy.contains('will not answer today')
            })
        })

        it('Scores are counted for answered, not-answered and excluded members', () => {
            const testDesc = 'test-desc-3'
            const testQuest = 'test-quest-3'

            cy.contains('Add Question').click()
            cy.contains('New question')

            cy.getTest('add-question-dropdown').click()
            cy.getTest('add-question-dropdown').get('.menu').contains(settings.username).click()

            cy.getTest('add-question-description').type(testDesc)
            cy.getTestInput('add-question-question').type(testQuest)

            cy.get('.modal').contains('Add').click()

            cy.getTest('answer-row').should('have.length', 3)

            cy.getTest('answer-row').eq(0).within(x => {
                cy.getTestInput('answer-input').type('1')
                cy.contains('Save').click()
            })

            cy.getTest('answer-row').eq(1).within(x => {
                cy.contains('Exclude').click()
            })

            cy.getTest('questions-tab').contains('By ' + testMember3)
            cy.getTest('questions-tab').contains(testQuest).click()

            cy.get('.modal').contains('Edit').click()
            cy.get('.modal').within(x => cy.wrap(x).getTestInput('answer-input').type('111'))
            cy.get('.modal').contains('Save').click()

            cy.contains('Answered')
            cy.contains('Difference')

            cy.getTest('result-row').should('have.length', 3)

            cy.getTest('result-row').eq(0).within(x => {
                cy.contains('1st')
                cy.contains(testMember1)
            })

            cy.getTest('result-row').eq(1).within(x => {
                cy.contains('2nd')
                cy.contains(testMember2)
            })

            cy.getTest('result-row').eq(2).within(x => {
                cy.contains('3rd')
                cy.contains(testMember3)
            })
        })
    })
})
