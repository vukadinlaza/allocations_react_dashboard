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

  const { company_name, memo, dealParams: { keyHighlights, risks } } = deal;

  const keyHighlightItems = (keyHighlights || []).map((item, i) => {
    return (
      <li key={i}>{item}</li>
    );
  })
  const riskItems = (risks || []).map((item, i) => {
    return (
      <li key={i}>{item}</li>
    );
  })

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
        {keyHighlightItems.length > 0 ?
          keyHighlightItems :
          <p>There are no key highlights listed for <b>{company_name}.</b></p>
        }
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <div>{ReactHtmlParser(memo)}</div>
      </TabPanel>
      <TabPanel className="tab-panel" value={currentTab} index={2}>
      {riskItems.length > 0 ?
          riskItems :
          <p>There are no risks listed for <b>{company_name}.</b></p>
        }
      </TabPanel>
    </section>
  )
}

export default TabMenuPanel
