import React from 'react'
import _ from 'lodash'
import {gql} from 'apollo-boost'
import {
  Grid,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";
import {useQuery} from '@apollo/react-hooks'
import Loader from '../../../../utils/Loader'
import Box from "@material-ui/core/Box";
import CheckIcon from '@material-ui/icons/Check';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: "16px -16px"
  },
  board: {
    width: '100%',
    backgroundColor: "##FBFCFC",
    boxShadow: "none",
    border: "1px solid #70707040",
    borderRadius: "12px",
  },
  avatar: {
    margin: '0.25rem',
    height: 26,
    width: 26,
    background: "#00A0C6",
  },
  list: {
    padding: "8px"
  },
  listItem: {
    backgroundColor: "#F7F9FA",
    borderRadius: "12px",
    marginBottom: 6,
  }
}));

// if investment status is 'signed' item should show in 'KYC' column
// if investmen status is 'signed' AND user has a KYC document, item should show in 'Wire' column
// if investment status is 'wired' item should show in 'Complete' column

const boardData = [
  {title: 'Viewed', key: 'invited'},
  {title: 'Signed', key: 'sign'},
  // {title: 'KYC', key: 'kyc'},
  {title: 'Wired', key: 'wire'},
  {title: 'Completed', key: 'complete'},
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
    <Grid container spacing={2} justify="space-between">
      {categories.map((value) => (
        <Grid key={value.title} item xs={12} sm={3}>
          <Box height="100%" className={classes.board}>
            <Typography variant="h6" style={{padding: "8px", textTransform: "uppercase", fontSize: "16px"}}>
              {value.title}
            </Typography>
            <List dense className={classes.list}>
              {value?.categoryInvestments?.map(inv => <InvestmentSquare investment={inv}/>)}
            </List>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

const checked = true;

const InvestmentSquare = ({investment}) => {
  const classes = useStyles();
  return (
    <ListItem disableGutters className={classes.listItem}>
      <ListItemAvatar>
        <Avatar alt={investment.investor.email} className={classes.avatar}>
          {investment.investor.email.charAt(0).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={investment.investor.email}/>
      <ListItemSecondaryAction>
        <FontAwesomeIcon icon={checked ? 'check-circle' : 'times-circle'} size="lg"
                         color="#39BE53"/>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
