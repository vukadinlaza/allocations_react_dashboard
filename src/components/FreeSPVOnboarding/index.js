import React, {useState, useEffect} from 'react'
import {isEqual} from "lodash"
import {useParams, useHistory} from "react-router-dom"
import {Paper, TextField} from '@material-ui/core'
import {Row, Col} from 'reactstrap'
import {useSimpleReducer} from '../../utils/hooks'

import {gql} from 'apollo-boost'
import {useMutation} from '@apollo/react-hooks'
import {ORG_OVERVIEW} from '../admin/AdminHome'
import {Button} from '@material-ui/core'
import FormError from '../forms/Error'
import "./style.scss"
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

const CREATE_ORG_AND_DEAL = gql`
  mutation CreateOrgAndDeal($orgName: String!, $deal: DealInput!) {
    createOrgAndDeal(orgName: $orgName, deal: $deal) {
      _id
      organization {
        _id
        slug
      }
    }
  }
`

const emptyDeal = {
  company_name: "",
  deal_lead: "",
  company_description: "",
  date_closed: "",
  onboarding_link: "",
  pledge_link: ""
}


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    maxWidth: 800,
    marginBottom: theme.spacing(2),
  },
  divider: {
    margin: "16px -16px"
  },
}));

export default function FreeSPVOnboarding() {
  const history = useHistory()
  const [orgName, setOrgName] = useState("")
  const [deal, setDeal] = useSimpleReducer(emptyDeal)
  const [hasChanges, setHasChanges] = useState(false)
  const classes = useStyles();

  const [createOrgAndDeal, {error}] = useMutation(CREATE_ORG_AND_DEAL, {
    onCompleted: ({createOrgAndDeal: deal}) =>
      history.push(`/admin/${deal.organization.slug}/deals/${deal._id}/edit`)
  })

  const submit = () => {
    createOrgAndDeal({variables: {orgName, deal}})
  }

  useEffect(() => {
    setHasChanges(!isEqual(deal, {}))
  }, [deal])

  return (
    <>
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Create Fund
            </Typography>
          </Grid>

        </Grid>

        <Divider className={classes.divider}/>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField style={{width: "100%"}}
                       value={orgName}
                       onChange={e => setOrgName(e.target.value)}
                       label="Fund Name"
                       variant="outlined"/>
          </Grid>
        </Grid>
      </Paper>

      <form className="form" noValidate autoComplete="off">
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Create SPV
              </Typography>
            </Grid>

          </Grid>

          <Divider className={classes.divider}/>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField style={{width: "100%"}}
                         value={deal.company_name}
                         onChange={e => setDeal({company_name: e.target.value})}
                         label="Company Name"
                         variant="outlined"/>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField style={{width: "100%"}}
                         value={deal.deal_lead}
                         onChange={e => setDeal({deal_lead: e.target.value})}
                         label="Deal Lead"
                         variant="outlined"/>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField style={{width: "100%"}}
                         value={deal.company_description}
                         onChange={e => setDeal({company_description: e.target.value})}
                         label="Company Description"
                         variant="outlined"/>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField style={{width: "100%"}}
                         value={deal.date_closed}
                         onChange={e => setDeal({date_closed: e.target.value})}
                         label="Closing Date"
                         variant="outlined"/>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button disabled={!hasChanges}
                      variant="contained"
                      onClick={submit}
                      color="primary">
                CREATE
              </Button>
            </Grid>

          </Grid>
        </Paper>
      </form>
    </>
  )
}
