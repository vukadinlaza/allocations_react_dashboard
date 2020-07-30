import React from 'react'

import {gql} from 'apollo-boost'
import { Grid, Paper, Typography } from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";
import {useQuery} from '@apollo/react-hooks'



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

const boardData = [
    {title: 'Viewed', key: 'invited'},
    {title: 'Signed', key: 'signed'},
    {title: 'KYC', key: 'kyc'},
    {title: 'Wired', key: 'complete'},
]


export const DEAL_INVESTMENTS = gql`
  query investmentsByDeal($dealId: String!) {
    investmentsByDeal(dealId: $dealId) {
      _id
      invited_at
      status
    }
  }
`


export default ({deal}) => {
    console.log(deal)
    const classes = useStyles()
    const categories = boardData.map(type => {
        const categoryInvestments = deal.investments.filter(inv => {
            return inv.status === type.key
        })
        return {...type, categoryInvestments }
    })

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
                            {value.categoryInvestments.map(inv => <InvestmentSquare investment={inv} /> )}
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