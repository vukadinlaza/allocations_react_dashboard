import React, { useState } from 'react'
import { Tabs, Tab, AppBar, Box, Typography } from '@material-ui/core'
import './styles.scss'
import ReactHtmlParser from 'react-html-parser';


const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="tab-panel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      { value === index && (
        <Box p={3}>
          {children}
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
        {keyHighlights && keyHighlights.length > 0 ?
          ReactHtmlParser(keyHighlights) :
          <span className="no-data">No key highlights listed for <b>{company_name}.</b></span>
        }
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        {memo && memo.length > 0 ?
          ReactHtmlParser(memo) :
          <span className="no-data">No memos listed for <b>{company_name}.</b></span>
        }
      </TabPanel>
      <TabPanel className="tab-panel" value={currentTab} index={2}>
        {risks && risks.length > 0 ?
          ReactHtmlParser(risks) :
          <span className="no-data">No risks listed for <b>{company_name}.</b></span>
        }
      </TabPanel>
    </section>
  )
}

export default TabMenuPanel
