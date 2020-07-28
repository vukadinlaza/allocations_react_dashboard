import React, {useState} from 'react'
import {
  Paper,
  Grid,
  TextField,
  Button,
  ButtonBase,
  Table,
  TableBody,
  ButtonGroup,
  TableCell,
  TableRow,
  Typography,
  TableHead
} from '@material-ui/core';
import classNames from 'classnames'
import {makeStyles} from "@material-ui/core/styles";


import ActiveDeals from './active-deals'
import OrgCards from './org-cards'
import ClosedDeals from './closed-deals'
import Loader from '../../../utils/Loader'



const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    backgroundColor: "#f9fbfb",
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
    height: 44,
    width: "100%"
  },
  activeTab: {
    height: 44,
    width: "100%",
    borderBottom: "3px solid #25a9df",
    outline: "0 !important",
  },
  button: {
    margin: ".5rem"
  },
  orgName: {
      color: '#707070',
      fontWeight: 'bolder'
  }
}));


export default function OrganizationOverview({orgData}) {
  const [tab, setTab] = useState("profile")
  const classes = useStyles();

  if (!orgData) return <Paper style={{padding: "25px"}}><Loader/></Paper>
    const {organization } = orgData
  return (
    <>
    <Typography variant="h3" className={classes.orgName}>
    {organization.name}
    </Typography>
      <div className={classes.tabs}>
        <Grid container justify="center">
          <Grid item xs={12} sm={3}>
            <ButtonBase className={tab === "profile" ? classes.activeTab : classes.tab}
                        style={{borderRight: "1px solid #e1e9ec"}}
                        onClick={() => setTab('profile')}>
              Organization
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={3}>
            <ButtonBase className={tab === "active-deals" ? classes.activeTab : classes.tab}
                        style={{}}
                        onClick={() => setTab('active-deals')}>
              Active Deals
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={3}>
            <ButtonBase className={tab === "closed-deals" ? classes.activeTab : classes.tab}
                        style={{}}
                        onClick={() => setTab('closed-deals')}>
             Closed Deals
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={3}>
            <ButtonBase className={tab === "all-investors" ? classes.activeTab : classes.tab}
                        style={{}}
                        onClick={() => setTab('all-investors')}>
              Investors
            </ButtonBase>
          </Grid>
        </Grid>
      </div>

      <>
        {tab === "active-deals" && <ActiveDeals orgData={orgData}/>}
        {tab === "closed-deals" && <ClosedDeals orgData={orgData}/>}
        {tab === "profile" && <OrgCards organization={organization} investor={orgData.investor}/>}
      </>
    </>
  )
}
