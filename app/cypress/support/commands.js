
/* global cy Cypress */

Cypress.commands.add('login', ({userName, password}) => {
    cy.request('POST', 'http://localhost:3001/api/login',{
        userName: 'jmferreyra',
        password: 'Aloha123!'
    }).then(res => {
        localStorage.setItem(
            'loggedNoteAppUser', JSON.stringify(res.body)
        )
        cy.visit('http://localhost:3000')
    })
})
