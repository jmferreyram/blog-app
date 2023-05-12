
/* global cy */

describe('Blog app', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.request('POST', 'http://localhost:3001/api/reset')

        const user = {
            name: 'Juan Manuel',
            userName: 'jmferreyra',
            password: 'Aloha123!'
        }

        cy.request('POST', 'http://localhost:3001/api/users',user)
    })
    it('frontpage can be opened', () => {
        cy.contains('Blogs JM')
    })

    it('User can log in', () => {
        cy.contains('Show Login').click()
        cy.get('[placeholder="Username"]').type('jmferreyra')
        cy.get('[placeholder="Password"]').type('Aloha123!')
        cy.get('#form-login-button').click()
        cy.get('[data-test-id="form-blog-id"]')
        
    })

    it('Wrong credentials', () => {
        cy.contains('Show Login').click()
        cy.get('[placeholder="Username"]').type('jerreyra')
        cy.get('[placeholder="Password"]').type('incorrecta')
        cy.get('#form-login-button').click()

        cy.get('.error')
            .should('contain','Wrong credentials')
            .should('have.css','color','rgb(255, 0, 0)')
    })

    describe('When logged in', () => {
        beforeEach(() => {
            cy.login({userName: 'jmferreyra', password: 'Aloha123!'})
        })

        it('create a new blog', () => {
            cy.get('[placeholder="Write your title"]').type('Gordisi sin frotera')
            cy.get('[placeholder="Write the Author"]').type('Melissa')
            cy.get('[placeholder="Write the URL"]').type('asdasdas')
            cy.get('[placeholder="Write the Likes"]').type('2')
            cy.contains('add').click().contains('Gordisi sin frontera')

        })
    })
})

