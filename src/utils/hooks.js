import { useReducer } from 'react'

/***
 *
 * simple helper hooks
 * useSimpleReducer provides this.setState({ [prop]: value })
 * syntax to hooks for state objects
 *
 **/

const reducer = (prev, updatedProp) => ({
  ...prev,
  ...updatedProp
})

export function useSimpleReducer(init) {
  return useReducer(reducer, init)
}

export function useToggle(init) {
  return useReducer((prev) => !prev, init)
}
