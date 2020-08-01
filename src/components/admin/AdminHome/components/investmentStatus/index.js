import React from 'react'
import _ from 'lodash'
import {gql} from 'apollo-boost'
import { Grid, Paper, Typography } from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";
import {useQuery} from '@apollo/react-hooks'
import Loader from '../../../../utils/Loader'



const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    backgroundColor: "#f9fbfb",
    minWidth: '100%',
    minHeight: '400px'
  },
  divider: {
    margin: "16px -16px"
  },
  root: {
    flexGrow: 1,
  },
  innerPaper: {
      minWidth: '200px',
      minHeight: '250px'
  }
}));


// if investment status is signed they need to show in the wire cat
// if investment status is wired they need to show in the competed cat


const boardData = [
    {title: 'View', key: ''},
    {title: 'Sign', key: 'invited'},
    {title: 'KYC', key: 'signed'},
    {title: 'Wire', key: 'kyc'},
    {title: 'Complete', key: 'wired'},
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
    const { data , loading} = useQuery(DEAL_INVESTMENTS, {
        variables: {_id: deal._id},
        pollInterval: 500
    })
    const categories = boardData.map(type => {
        const categoryInvestments = data?.deal?.investments.filter(inv => {
            return inv.status === type.key
        })
        return {...type, categoryInvestments }
    }) || []

    if(loading) return <Loader/>

    return (
        <Grid container className={classes.root}>
            <Paper className={classes.paper}>
                <Grid item>
                    <Grid container justify="center" spacing={3}>
                    {categories.map((value) => (
                        <Grid key={value.title} item >
                            <Typography variant="h6">
                            {value.title}
                            </Typography>
                            <Paper className={classes.innerPaper}>
                            {value?.categoryInvestments?.map(inv => <InvestmentSquare investment={inv} /> )}
                            </Paper>
                        </Grid>
                    ))}
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}


const InvestmentSquare = ({investment}) => {

    return (
        <div>
            {investment.status}
            {investment.investor.email}
        </div>
    )

}