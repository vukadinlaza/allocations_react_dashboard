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
          TabIndicatorProps={{ style: { background: '#0561FF', height: '3px', width: '100%', left: '0' } }}
          className="tabs-container" value={currentTab}
          onChange={handleTabChange}
        >
          <Tab className="tab" label="Memo" />
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>
        {memo && memo.length > 0 ?
          ReactHtmlParser(memo) :
          <span className="no-data">No memos listed for <b>{company_name}.</b></span>
        }
      </TabPanel>
    </section>
  )
}

export default TabMenuPanel
