import { useReducer } from 'react'

const reducer = (prev, updatedProp) => ({
  ...prev,
  ...updatedProp
})

export function useSimpleReducer(init) {
  return useReducer(reducer, init)
}