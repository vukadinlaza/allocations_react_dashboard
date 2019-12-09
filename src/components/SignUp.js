import React, { useEffect, useState } from 'react'
import { gql } from "apollo-boost"
import { Redirect, useLocation } from "react-router-dom"
import { useMutation } from '@apollo/react-hooks'
import { useAuth0 } from "../react-auth0-spa"
import queryString from 'query-string'

const SIGNUP = gql`
  mutation SignUp($inviteKey: String) {
    signUp(inviteKey: $inviteKey) {
      _id
      email
      first_name
      last_name
      admin
    }
  }
`

function dataComplete (user) {
  return user.email && user.first_name && user.last_name
}

export default function SignUp () {
  const { search } = useLocation()
  const [signedIn, setSignedIn] = useState(false)
  const { user, isAuthenticated, loginWithRedirect } = useAuth0()
  const [signUp, {data, loading, error, called}] = useMutation(SIGNUP)

  const { key } = queryString.parse(search)

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated) {
        await loginWithRedirect({
          appState: { targetUrl: `/signup${search}` },
          initialScreen: 'signUp',
        });
      }
    };
    fn();
  }, [isAuthenticated, loginWithRedirect]);

  useEffect(() => {
    if (isAuthenticated && !called) signUp({ variables: { inviteKey: key }})
  }, [isAuthenticated])

  useEffect(() => {
    if (data) {
      console.log({data})
      setSignedIn(true)
    }
  }, [data])

  if (signedIn) {
    if (dataComplete(data.signUp)) {
      return <Redirect to="/" />
    } else {
      return <Redirect to={{ pathname: "/complete-signup", state: data.signUp }} />
    }   
  }

  return null
}