import React, { useState } from 'react';
import { Paper, Tabs, Tab, Box } from '@material-ui/core';
import Detail from './Detail';
import Memo from './Memo';
import PitchDeck from './PitchDeck';
import useStyles from '../DealStyles';

const data = [
  { title: 'Introduction', description: 'You currently do not have any content for this section' },
  { title: 'Problem', description: 'You currently do not have any content for this section' },
  { title: 'Product', description: 'You currently do not have any content for this section' },
  { title: 'How it Works', description: 'You currently do not have any content for this section' },
  { title: 'Market', description: 'You currently do not have any content for this section' },
  { title: 'Deal Terms', description: 'You currently do not have any content for this section' },
];

const pdf =
  'https://allocations-deal-applications-test.s3.us-east-2.amazonaws.com/606bddf03e016a0023d628e6/pitch-document-Zyzz_Bible.pdf';

export default function DealDetails() {
  const classes = useStyles();
  const [tab, setTab] = useState(0);

  const handleSetTab = (event, value) => {
    setTab(value);
  };

  return (
    <Paper className={classes.dealHeader}>
      <Box className={classes.box} style={{ display: 'block' }}>
        <Tabs value={tab} onChange={handleSetTab} indicatorColor="primary">
          <Tab label="Details" />
          <Tab label="Pitch Deck" />
          <Tab label="Memos" />
        </Tabs>
        {tab === 0 &&
          data.map(({ title, description }, index) => (
            <>
              <Detail title={title} description={description} />
              {index !== data.length - 1 && <hr />}
            </>
          ))}
        {tab === 1 && <PitchDeck pdf={pdf} />}
        {tab === 2 && <Memo pdf={pdf} />}
      </Box>
    </Paper>
  );
}
