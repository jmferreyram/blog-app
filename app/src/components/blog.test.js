import React from "react";
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './blog'
import Togglable from "./Togglable";

test('render content', () => {
    const blog = {
        title: 'Rey arturo',
        author: 'Juanmanuel'
    }

    const component = render(
        <Blog blog={blog}/>
    )

    expect(component.container).toHaveTextContent(
        'Rey arturo'
    )
})

describe('Component Togglable', () => {
    
    let component

    beforeEach(() => {
      component = render(
        <Togglable buttonLabel="show...">
          <div className="testDiv" />
        </Togglable>
      )
    })

    test('Render its child', () => {
        expect(
            component.container.querySelector('.testDiv')
            ).toBeDefined()
    })

    test('at start we can see the button label', () => {
        const div = component.container.querySelector('.togglableContent')

        expect(div).not.toHaveStyle('display: none')
    })

    test('after push button the element disspaear', () => {
        
        const button = component.getByText('show...')
        fireEvent.click(button)

        const div = component.container.querySelector('.togglableContent')

        expect(div).toHaveStyle('display: none')
    })

})