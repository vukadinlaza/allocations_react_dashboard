import { useReducer } from 'react'

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