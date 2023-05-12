import React from 'react'
import Togglable from './Togglable'

export default function FormSubmitLogin (props) {

  return (
    <Togglable buttonLabel={'Show Login'}>
      <form onSubmit={props.handleLoginSubmit}>
          <div>
          <input
            type = 'text'
            value = {props.userName}
            name = 'Username'
            placeholder = 'Username'
            onChange={props.handleUserNameChange} 
          />
          </div>
          <div>
          <input
            type = 'password'
            value = {props.password}
            name = 'Password'
            placeholder = 'Password'
            onChange={props.handlePasswordChange} 
          />
          </div>
          <button id='form-login-button'>
            Login
          </button>

        </form>
    </Togglable>
  )
}