import React, { useState } from 'react'
import { Tabs, Tab, AppBar, Box, Typography } from '@material-ui/core'
import './styles.scss'
import ReactHtmlParser from 'react-html-parser';


const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      { value === index && (
        <Box p={3}>
          <Typography>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  )
}

function TabMenuPanel({ deal }) {

  const [currentTab, setCurrentTab] = useState(0)
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const { memo } = deal;
  console.log(memo)

  return (
    <section className="TabMenuPanel">
      <AppBar position="static">
        <Tabs
          centered
          TabIndicatorProps={{ style: { background: '#0561FF', height: '3px' } }}
          className="tabs-container" value={currentTab}
          onChange={handleTabChange}
        >
          <Tab className="tab" label="Key Highlights" />
          <Tab className="tab" label="Memos" />
          <Tab className="tab" label="Risks" />
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>
        <p>Miami-focused VC fund founded by 4 Miami based tech CEOs</p>
        <p>Goal to fund and support the next 100 unicorns in Miami</p>
        <p>$2m target size of Fund 1</p>
        <p>GPs are successful active Founders ($250m + in valuation)</p>
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <div>{ ReactHtmlParser(memo) }</div>
      </TabPanel>
      <TabPanel className="tab-panel" value={currentTab} index={2}>
        <p>These are some risks about this deal...</p>
      </TabPanel>
    </section>
  )
}

export default TabMenuPanel
