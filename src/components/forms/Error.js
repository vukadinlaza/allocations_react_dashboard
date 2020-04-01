import React from 'react'

export default function FormError ({ error }) {
  if (!error) return null
  
  const msg = error.message.slice(0, 15) === "GraphQL error: " ? error.message.slice(15) : error.message
  return (
    <div style={{backgroundColor: "tomato", color: "#fff", borderRadius: "4px", padding: "10px 20px", margin: "10px 0px"}}>
      {msg}
    </div>
  )
}