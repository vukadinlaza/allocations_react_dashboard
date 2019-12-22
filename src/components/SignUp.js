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
      first_name
      last_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
    }
  }
`

const required = ['first_name', 'last_name', 'country', 'investor_type', 'signer_full_name', 'accredited_investor_status', 'email']
function dataComplete (user) {
  for (let i = 0; i < required.length; i++) {
    if (!user[required[i]]) return false
  }
  return true
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
    return <Redirect to={key ? "/invited-deals" : "/"} />
    
    // return <Redirect to={{ 
    //   pathname: "/complete-signup", 
    //   state: { ...data.signUp, redirect: key ? "/invited-deals" : "/" } 
    // }} />
  }

  return null
}