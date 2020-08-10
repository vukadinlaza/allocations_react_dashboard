import React, {useState} from 'react'
import {
  Paper,
  Grid,
  ButtonBase,
  Typography,
} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";

import ActiveDeals from './active-deals'
import OrgCards from './org-cards'
import ClosedDeals from './closed-deals'
import Loader from '../../../utils/Loader'
import Investors from '../../../Investors'
import NullPaper from "../../../NullPaper";
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
    height: 75,
    width: "100%"
  },
  subtitle: {
    color: "#3A506B",
    marginTop: 16
  },
  activeTab: {
    height: 75,
    paddingTop: 6,
    width: "100%",
    borderBottom: "6px solid #205DF5",
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


export default function OrganizationOverview({orgData, superAdmin}) {
  const [tab, setTab] = useState("organization");
  const classes = useStyles();

  if (!orgData) return <Paper style={{padding: "25px"}}><Loader/></Paper>
  const {organization} = orgData
  return (
    <>
      <Grid container justify="space-between">
        <Grid item sm={12} md={6}>
          <Typography variant="h4" className={classes.orgName}>
            {organization.name}
          </Typography>
        </Grid>
        <Grid item sm={12} md={6}>
          <Typography variant="body2" style={{textAlign: "right"}}>
            {superAdmin}
          </Typography>
        </Grid>
      </Grid>

      <div className={classes.tabs}>
        <Grid container>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={tab === "organization" ? classes.activeTab : classes.tab}
                        onClick={() => setTab('organization')}>
              Organization
            </ButtonBase>
          </Grid>
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
            <ButtonBase className={tab === "all-investors" ? classes.activeTab : classes.tab}
                        onClick={() => setTab('investments')}>
              Investments
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={tab === "setting" ? classes.activeTab : classes.tab}
                        style={{borderRight: "1px solid #e1e9ec"}}
                        onClick={() => setTab('setting')}>
              Settings
            </ButtonBase>
          </Grid>
        </Grid>
      </div>

      <>
        {tab === "organization" && <Organization/>}
        {tab === "active-deals" && <ActiveDeals orgData={orgData}/>}
        {tab === "closed-deals" && <ClosedDeals orgData={orgData}/>}
        {tab === "profile" && <OrgCards organization={organization} investor={orgData.investor}/>}
        {tab === "all-investors" && <Investors/>}
      </>
    </>
  )
}

function Organization() {
  const classes = useStyles();

  return <>
    <Paper className={classes.paper} style={{marginBottom: 16}}>
      <Grid container spacing={3}>
        <Grid item sm={12} md={6}>
          <Typography variant="subtitle1" className={classes.subtitle}>
            Address
          </Typography>
          <Typography variant="body2">
            8 The Green, Suite 7105<br/>
            Dover, Delaware 19901
          </Typography>
          <Typography variant="subtitle1" className={classes.subtitle}>
            Admin Name
          </Typography>
          <Typography variant="body2">
            Kingsley Advani
          </Typography>
        </Grid>

        <Grid item sm={12} md={6}>
          <Typography variant="subtitle1" className={classes.subtitle}>
            Contact
          </Typography>
          <Typography variant="body2">
            <a href="mailto:support@goldmount.com">
              support@goldmount.com
            </a>
          </Typography>
          <Typography variant="subtitle1" className={classes.subtitle}>
            Website
          </Typography>
          <Typography variant="body2">
            goldmount.com
          </Typography>
        </Grid>
      </Grid>
    </Paper>

    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={6}>
        <NullPaper title="Statement of Work" text="TODO: SpaceX SPV" /*TODO Get Company SPV Description here */
                   image={allocations_statement_of_work} button="Get Started"/>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <NullPaper title="Provision of Services"
                   text="One click signing for your POS"
                   image={allocations_provisions_of_services} button="Get Started"/>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <NullPaper title="Company Profile"
                   text="Finish your company profile" /*TODO Get Company SPV Description here */
                   image={allocations_company_profile} button="Get Started"/>
      </Grid>
    </Grid>
  </>;
}
