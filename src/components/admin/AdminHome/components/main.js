import React, { useState, useEffect } from 'react'
import {
  Paper,
  Grid,
  ButtonBase,
  Typography,
  FormControl,
  Button,
  TextField
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from '@apollo/react-hooks'
import { toLower, get, pick } from 'lodash'
import { gql } from 'apollo-boost'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom"
import ActiveDeals from './active-deals'
import OrgCards from './org-cards'
import ClosedDeals from './closed-deals'
import Loader from '../../../utils/Loader'
import Investors from '../../../Investors'
import NullPaper from "../../../NullPaper";
import Investments from '../../../Investments'
import allocations_statement_of_work from "../../../../assets/allocations_statement_of_work.svg";
import allocations_provisions_of_services from "../../../../assets/allocations_provisions_of_services.svg";
import allocations_company_profile from "../../../../assets/allocations_company_profile.svg";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  divider: {
    margin: "16px -16px"
  },
  tabs: {
    borderTop: "1px solid #dfe3e9",
    borderBottom: "1px solid #dfe3e9",
    background: "#f7f9fa",
    minHeight: 44,
    margin: "40px 0",
  },
  text: {
    color: "#7f8ea3"
  },
  tab: {
    height: 42,
    width: "100%"
  },
  subtitle: {
    color: "#3A506B",
    marginTop: 16
  },
  activeTab: {
    height: 42,
    paddingTop: 3,
    width: "100%",
    borderBottom: "3px solid #205DF5",
    outline: "0 !important",
  },
  button: {
    margin: ".5rem"
  },
  orgName: {
    color: '#3A506B',
    fontWeight: 'bolder'
  }
}));


export default function OrganizationOverview({ orgData, superAdmin, refetch }) {
  const [tab, setTab] = useState("active-deals");
  const classes = useStyles();

  if (!orgData) return <Paper style={{ padding: "25px" }}><Loader /></Paper>
  const { organization } = orgData
  return (
    <>
      <Grid container justify="space-between">
        <Grid item sm={12} md={6}>
          <Typography variant="h4" className={classes.orgName}>
            {organization.name}
          </Typography>
        </Grid>
        <Grid item sm={12} md={6}>
          <Typography variant="body2" style={{ textAlign: "right" }}>
            {superAdmin}
          </Typography>
        </Grid>
      </Grid>

      <div className={classes.tabs}>
        <Grid container>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={tab === "active-deals" ? classes.activeTab : classes.tab}
              onClick={() => setTab('active-deals')}>
              Active Deals
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={tab === "closed-deals" ? classes.activeTab : classes.tab}
              onClick={() => setTab('closed-deals')}>
              Closed Deals
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={tab === "all-investors" ? classes.activeTab : classes.tab}
              onClick={() => setTab('all-investors')}>
              Investors
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={tab === "investments" ? classes.activeTab : classes.tab}
              onClick={() => setTab('investments')}>
              Investments
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={tab === "setting" ? classes.activeTab : classes.tab}
              style={{ borderRight: "1px solid #e1e9ec" }}
              onClick={() => setTab('setting')}>
              Settings
            </ButtonBase>
          </Grid>
        </Grid>
      </div>

      <>
        {tab === "active-deals" && <ActiveDeals orgData={orgData} />}
        {tab === "closed-deals" && <ClosedDeals orgData={orgData} />}
        {tab === "profile" && <OrgCards organization={organization} investor={orgData.investor} />}
        {tab === "all-investors" && <Investors />}
        {tab === "investments" && <Investments />}
        {tab === "setting" && <Settings orgData={orgData.organization} investor={orgData.investor} refetch={refetch} />}
      </>
    </>
  )
}



const UPDATE_ORG = gql`
  mutation UpdateOrganization($organization: OrganizationInput!) {
    updateOrganization(organization: $organization) {
      _id
      name
      slug
    }
  }
`
function Settings({ investor, orgData, refetch }) {
  const classes = useStyles();
  const [organization, setOrganization] = useState(null)
  const [updateOrganization] = useMutation(UPDATE_ORG)

  useEffect(() => {
    if (orgData) {
      setOrganization(pick(orgData, ['name', '_id']))
    }
  }, [orgData])


  const handleChange = (prop) => e => {
    e.persist()
    if (prop === "investor_type") {
      return setOrganization(prev => ({ ...prev, [prop]: e.target.value, accredited_investor_status: "" }))
    } else {
      return setOrganization(prev => ({ ...prev, [prop]: e.target.value }))
    }
  }
  const docs = investor.documents ? investor.documents : [];
  const hasDoc = docs.find(d => toLower(d.documentName).includes(toLower('Provision')))
  return <>
    <Paper className={classes.paper} style={{ marginBottom: 16 }}>
      <Grid container spacing={3}>
        <Grid item sm={12} md={6}>
          <form noValidate autoComplete="off" style={{ padding: "16px" }}>
            <Typography variant="subtitle2" style={{ marginBottom: "16px" }}>
              This information can be edited from your organization settings page.
          </Typography>
            <Grid container spacing={3} style={{ marginTop: "16px" }}>

              <Grid item xs={12} sm={12} md={6}>
                <TextField required disabled
                  style={{ width: "100%" }}
                  value={get(organization, 'name') || ""}
                  onChange={handleChange("name")}
                  label="Organization Name"
                  variant="outlined" />
              </Grid>

            </Grid>

            <Button variant="contained" style={{ marginTop: 16 }}
              onClick={() => updateOrganization({
                variables: { organization }
              })}
              color="primary">
              Submit
            </Button>
          </form>
        </Grid>
      </Grid>
    </Paper>
  </>;
}
