import React, { useEffect, useState } from 'react'
import Loader from '../utils/Loader'
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      email
      investments {
        _id
        amount
        deal {
          _id
          company_name
          company_description
          date_closed
        }
        documents
      }
    }
  }
`

export default function Profile () {
  const [investor, setInvestor] = useState(null)
  const [getInvestor, { data, error }] = useLazyQuery(GET_INVESTOR)
  const { user } = useAuth0()

  useEffect(() => {
    if (user && user.email) getInvestor({ variables: { email: user.email }})
  }, [user])

  useEffect(() => {
    if (data) setInvestor(data.investor)
  }, [data])

  if (!investor) return <Loader />

  return (
    <div className="Profile">
      Profile for - {investor.first_name} {investor.last_name}
    </div>
  )
}