import React, {useState, useEffect} from 'react'
import {gql} from 'apollo-boost'
import {useHistory, useParams} from 'react-router-dom'
import {useMutation} from '@apollo/react-hooks'
import {TextField, Button, Typography, Grid} from '@material-ui/core'

/***
 *
 * Create New investor (just email) & then redirects to investor edit
 *
 **/

const CREATE_INVESTOR = gql`
  mutation CreateInvestor($user: UserInput!) {
    createInvestor(user: $user) {
      _id
    }
  }
`

export default function InvestorNew({push, setNewUser}) {
  const history = useHistory()
  const [error, setError] = useState(false)
  const [email, setEmail] = useState("")
  const [createInvestor, {data}] = useMutation(CREATE_INVESTOR)


  useEffect(() => {
    if (data && data.createInvestor._id && push) history.push(`/investor/${data.createInvestor._id}/edit`)
    if (data && data.createInvestor._id) {
      setNewUser(false)
    }
  }, [data, history])

  const submit = () => {
    if (!email) return setError(true)
    createInvestor({variables: {user: {email}}})
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Create Investor
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField required
                   error={error}
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   label="Email"
                   variant="outlined"/>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained"
                style={{marginTop: 16}}
                onClick={submit}
                color="primary">
          CREATE INVESTOR
        </Button>
      </Grid>
    </Grid>
  )
}
