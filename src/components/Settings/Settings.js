import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Tabs,
  Tab,
  Paper
} from '@material-ui/core';
import { getTabVariables } from './tabsVariables';
import ServerTable from '../utils/ServerTable';
import Loader from '../utils/Loader';
import { nWithCommas } from '../../utils/numbers'


const styles = theme => ({
  tab: {
    textTransform: 'none',
    '&:focus': {
      outline: "none"
    }
  }
});

const tabs = ['Users', 'Investments']

const Settings = ({ classes, history }) => {

  const [tabIndex, setTabIndex] = useState(0)
  const [tabVariables, setTabVariables] = useState(getTabVariables(tabIndex))


  const handleChangeTab = (event, newIndex) => {
    const tabVariables = getTabVariables(newIndex)
    setTabIndex(newIndex);
    setTabVariables(tabVariables)
  }


  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'investor':
        return (row[headerValue]? row[headerValue].email : 'No email found')
      case 'deal':
        return (row[headerValue]? row[headerValue].company_name : 'No company found')
      case 'amount':
        return nWithCommas(row[headerValue])
      case 'count':
        return row[headerValue].length
      case 'link':
        return <a href={`/investor/${row._id}/home`}>Link</a>
      default:
        return <div></div>
    }
  }

  const handleRowDetailPage = (row) => {
    switch (tabIndex) {
      case 0:
        history.push(`/admin/users/${row._id}`)
        break;
      case 1:
        history.push(`/admin/invesments/${row._id}`)
        break
      default:
        return
    }
  }

  if (!tabVariables) return <Loader />;

  return (
    <div className={classes.root}>
      <Paper square>
        <Tabs
          value={tabIndex}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          >
          {tabs.map((tab, index) =>
            <Tab label={tab} key={`tab-${index}`} className={classes.tab}/>
          )}
        </Tabs>
      </Paper>

      <ServerTable
        tableVariables={tabVariables}
        getCellContent={getCellContent}
        handleRowDetailPage={handleRowDetailPage}
        />
  </div>
  );
}

export default withStyles(styles)(withRouter(Settings));
