import React, { useState } from 'react'
import { AppBar, Tabs, Tab, Box, Typography, TextField } from '@material-ui/core'
import './styles.scss'
import { Button } from '@material-ui/core'
import plaidLogo from '../../../../assets/plaid.svg'


function PaymentInformation() {


  const [currentTab, setCurrentTab] = useState(0)
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

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
          <Box centered p={3}>
              {children}
          </Box>
        )}
      </div>
    )
  }


  return (
    <section className="PaymentInformationPanel">
      <p className="section-label">Payment Information</p>
      <AppBar position="static">
        <Tabs
          centered
          TabIndicatorProps={{ style: { background: '#0561FF', height: '3px' } }}
          className="tabs-container" value={currentTab}
          onChange={handleTabChange}
        >
          <Tab className="tab" label="Bank account" />
          <Tab className="tab" label="Card" />
          <Tab className="tab" label="Bank wire" />
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>

        <div class="payment-buttons">
          <div className="plaid-container">
            <Button className="plaid-button">Connect bank account</Button>
            <img src={plaidLogo} />
          </div>
          <Button className="manual-payment-button">
            Add manually
          </Button>
        </div>

      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <div className="card-information">
          <TextField
            variant="outlined"
            placeholder="Enter card number"
            className="card-number" />
          <TextField
            variant="outlined"
            placeholder="Exp"
            className="expiration" />
          <TextField
            variant="outlined"
            placeholder="CVV"
            className="cvv" />
        </div>
      </TabPanel>
      <TabPanel className="tab-panel" value={currentTab} index={2}>
        <div className="bank-wire">
          <TextField
            variant="outlined"
            placeholder="Enter bank name"
            className="bank-name" />
          <TextField
            variant="outlined"
            placeholder="Enter routing number"
            className="routing-number" />
          <TextField
            variant="outlined"
            placeholder="Enter account number"
            className="account-number" />
        </div>
      </TabPanel>
    </section>
  )
}

export default PaymentInformation
