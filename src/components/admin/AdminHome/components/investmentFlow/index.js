import React from 'react'
import _ from 'lodash'
import {gql} from 'apollo-boost'
import {Grid, Paper, Typography, Avatar} from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";
import {useQuery} from '@apollo/react-hooks'
import Loader from '../../../../utils/Loader'


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    backgroundColor: "#FFFFFF",
    minWidth: '100%',
    minHeight: '400px'
  },
  divider: {
    margin: "16px -16px"
  },
  innerPaper: {
    minWidth: '200px',
    minHeight: '250px',
    backgroundColor: "##FBFCFC",
  },
  avatar: {
    margin: '0.25rem',
    backgroundColor: 'blue',
  }
}));

// if investment status is 'signed' item should show in 'KYC' column
// if investmen status is 'signed' AND user has a KYC document, item should show in 'Wire' column
// if investment status is 'wired' item should show in 'Complete' column

const boardData = [
  {title: 'View', key: 'invited'},
  {title: 'Sign', key: 'sign'},
  // {title: 'KYC', key: 'kyc'},
  {title: 'Wire', key: 'wire'},
  {title: 'Complete', key: 'complete'},
]


export const DEAL_INVESTMENTS = gql`
  query deal($_id: String!) {
    deal(_id: $_id) {
      _id
      investments {
          status
          amount
          investor {
              email
              documents
          }
      }
    }
  }
`

export default ({deal}) => {
  const classes = useStyles()
  const {data, loading} = useQuery(DEAL_INVESTMENTS, {
    variables: {_id: deal._id},
    pollInterval: 500
  })
  const investments = data?.deal?.investments.map(inv => {
    const hasKycDoc = inv.investor?.documents?.find(d => d.documentName && (d.documentName.includes('W-8') || d.documentName.includes('W-9')))
    if (inv.status === 'invited' && !hasKycDoc) {
      inv.status = 'sign'
      return inv
    }
    /*if (inv.status === 'signed' && !hasKycDoc) {
      inv.status = 'kyc'
      return inv
    }*/
    if (inv.status === 'signed' && hasKycDoc) {
      inv.status = 'wire'
      return inv
    }
    if (inv.status === 'wired') {
      inv.status = 'complete'
      return inv
    }
    return inv
  })
  const groupedInvestments = _.groupBy(investments, 'status')

  const categories = boardData.map(type => {
    const categoryInvestments = groupedInvestments[type.key]
    return {...type, categoryInvestments}
  }) || []

  if (loading) return <Loader/>

  return (
    <Grid container justify="center" spacing={3}>
      {categories.map((value) => (
        <Grid key={value.title} item>
          <Paper className={classes.innerPaper}>
          <Typography variant="h6" gutterBottom style={{padding:"8px"}}>
            {value.title}
          </Typography>
            {value?.categoryInvestments?.map(inv => <InvestmentSquare investment={inv}/>)}
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}


const InvestmentSquare = ({investment}) => {
  const classes = useStyles();
  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt={investment.investor.email} className={classes.avatar}/>
      {investment.investor.email}
    </Grid>
  )
}
