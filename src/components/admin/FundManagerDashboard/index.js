import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import { SimpleBox, ChartBox, FlatBox, ListBox } from './widgets'
import AllocationsTable from '../../utils/AllocationsTable'
import { nWithCommas } from '../../../utils/numbers'

const styles = theme => ({
  dashboardContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%"
  },
  sectionTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "35px"
  },
  section: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: "40px"
  },
  widgetRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap"
  }
});

const FundManagerDashboard = ({ classes }) => {

  const highlightsHeaders = [
    { value: 'name', label: 'NAME' },
    { value: 'tagline', label: 'TAGLINE' },
    { value: 'date', label: 'DATE', type: 'date' },
    { value: 'investment', label: 'INVESTMENT', type: 'amount' },
  ]

  const highlightsData = [
    { name: 'Luminous Computing', tagline: 'Photonics chips to tackle AI workloads', date: new Date(), investment: 25000},
    { name: 'Browder Capital LP', tagline: 'Early stage technology fund', date: new Date(), investment: 50000},
  ]

  const getCellContent = (type, row, value) => {
    switch (type) {
      case 'date':
        return moment(row[value]).format('MM/DD/YYYY');
      case 'amount':
        return `$${nWithCommas(row[value])}`
      default:
        return
    }
  }

  const buttonAction = () => {
    console.log('HEY');
  }

  return (
    <div className={classes.dashboardContainer}>
      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Setup</Typography>
        <div className={classes.widgetRow}>
          <SimpleBox size="third" title="Initial Build" info="Explanation">Child</SimpleBox>
          <SimpleBox size="third" title="Pre-onboarding" info="Explanation">Child</SimpleBox>
          <SimpleBox size="third" title="Ready To Onboard Investors" info="Explanation">Child</SimpleBox>
          <SimpleBox size="third" title="Target Raise" info="Explanation">Child</SimpleBox>
          <SimpleBox size="third" title="Next Close Date" info="Explanation">Child</SimpleBox>
          <SimpleBox size="third" title="Final Close Date" info="Explanation">Child</SimpleBox>
          <SimpleBox size="third" title="Management Fee" info="Explanation">Child</SimpleBox>
          <SimpleBox size="third" title="Carry" info="Explanation">Child</SimpleBox>
          <SimpleBox size="third" title="Raise Type" info="Explanation">Child</SimpleBox>
        </div>
      </div>

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Highlights</Typography>
        <div className={classes.widgetRow}>
          <SimpleBox size="half" title="Committed" info="Explanation">Child</SimpleBox>
          <SimpleBox size="half" title="Closed" info="Explanation">Child</SimpleBox>
          <SimpleBox size="third" title="Portfolio Value" info="Explanation">Child</SimpleBox>
          <SimpleBox size="third" title="Total Invested" info="Explanation">Child</SimpleBox>
          <SimpleBox size="third" title="Multiple" info="Explanation">Child</SimpleBox>
          <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
            <ChartBox title="Portfolio Overview" info="Explanation">Child</ChartBox>
            <ChartBox title="Value" info="Explanation">Child</ChartBox>
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Highlights</Typography>
        <div className={classes.widgetRow}>
          <AllocationsTable
            data={highlightsData}
            headers={highlightsHeaders}
            getCellContent={getCellContent}
            />
        </div>
      </div>

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Investor Onboarding Status</Typography>
        <div className={classes.widgetRow}>
          <ListBox
            title="VIEWED"
            total="$0"
            size="third"
            buttonText={<div><MailIcon style={{color: "white", marginRight: "0.5em"}}/>Send Reminder</div>}
            buttonAction={buttonAction}
            >
            
          </ListBox>
          <ListBox
            title="SIGNED"
            total="$400,000"
            size="third"
            buttonText={<div><MailIcon style={{color: "white", marginRight: "0.5em"}}/>Send Reminder</div>}
            buttonAction={buttonAction}
            >
          </ListBox>
          <ListBox
            title="WIRED"
            total="$0"
            size="third"
            >
          </ListBox>
        </div>
      </div>

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Deal Page</Typography>
        <div className={classes.widgetRow}>
          <FlatBox title="SHARE" info="Explanation">Child</FlatBox>
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(FundManagerDashboard);
