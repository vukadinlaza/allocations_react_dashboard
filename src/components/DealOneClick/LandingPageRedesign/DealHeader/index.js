import React, { useState, useEffect } from 'react';
import {
  Paper,
  Avatar,
  Button,
  Box,
  CardMedia,
  Grid,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import useStyles from '../DealStyles';
import { SimpleBox } from '../widgets/SimpleBox';

function DealHeader({ deal }) {
  const {
    company_name,
    dealCoverImageKey,
    slug,
    dealParams: { wireDeadline, signDeadline },
  } = deal;

  const classes = useStyles();

  const key = dealCoverImageKey?.includes('https')
    ? dealCoverImageKey
    : `https://allocations-public.s3.us-east-2.amazonaws.com/${dealCoverImageKey}`;

  const [img, setImg] = useState(key);
  const [openTooltip, setOpenTooltip] = useState('');

  useEffect(() => {
    setImg(key);
  }, [dealCoverImageKey, slug, key]);

  const handleTooltip = (id) => {
    setOpenTooltip(id);
  };

  const getDeadline = (date) => {
    return moment(date).format('MM/DD/YYYY');
  };

  return (
    <>
      <div className={classes.placeholder}>placeholder</div>

      <Paper className={classes.dealHeader} style={{ background: '' }}>
        <Box className={classes.box}>
          <Box display="flex">
            <Avatar className={classes.avatar} />
            <h3 className={classes.companyName} style={{ background: '' }}>
              {company_name}
            </h3>
          </Box>
        </Box>

        <Grid container className={classes.middleGridContainer} style={{ background: '' }}>
          <Grid item xs={6} style={{ background: '' }}>
            <CardMedia
              className={classes.cardMedia}
              component="img"
              alt="SPV Header Image"
              src={img}
              onError={() =>
                setImg('https://allocations-public.s3.us-east-2.amazonaws.com/deals/default.png')
              }
            />
          </Grid>
          <Grid item xs={6} style={{ background: '' }}>
            <h4 className={classes.investmentProgress}>Investment Progress</h4>
            <container>
              <h6 className={classes.investmentNumber}>$320,000</h6>
              <LinearProgress
                variant="determinate"
                value="10"
                className={classes.BorderLinearProgress}
              />
              <div className={classes.minorText}>
                <span className={classes.floatRight}>
                  Total Raise Amount:<span>$600,000</span>
                </span>
              </div>
            </container>

            <Button className={classes.investButton}>Invest</Button>
            <Grid container style={{ background: '', marginTop: '15px' }}>
              <Grid item xs={6} style={{ background: '' }}>
                Invest With:{' '}
                <div style={{ display: 'flex' }}>
                  <div className={classes.coinvestorTagBubble}>
                    <span className={classes.coinvestorTagText}>USD</span>
                  </div>
                  <div className={classes.coinvestorTagBubble}>
                    <span className={classes.coinvestorTagText}>USDC</span>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: '',
                    marginLeft: '20px',
                  }}
                >
                  <div>Minimum Investment:</div>
                  <div>$600,000</div>
                </div>
              </Grid>
            </Grid>

            <div className={classes.modalContainer} style={{ background: '' }}>
              <SimpleBox
                className={classes.modalParent}
                title="Signing Deadline"
                openTooltip={openTooltip}
                handleTooltip={handleTooltip}
                id="signing"
                tooltipContent={
                  <Typography color="inherit">
                    This is the total capital received into the private fund’s bank account
                    (including loans and drawdowns)
                  </Typography>
                }
              >
                <Typography style={{ fontSize: '14px' }}>
                  {' '}
                  {signDeadline
                    ? getDeadline(signDeadline)
                    : wireDeadline
                    ? getDeadline(wireDeadline)
                    : 'No signing deadline has been set.'}
                </Typography>
              </SimpleBox>
              <SimpleBox
                className={classes.modalParent}
                title="Wiring Deadline"
                openTooltip={openTooltip}
                handleTooltip={handleTooltip}
                id="wiring"
                tooltipContent={
                  <Typography color="inherit">
                    This is the total capital received into the private fund’s bank account
                    (including loans and drawdowns)
                  </Typography>
                }
              >
                <Typography style={{ fontSize: '14px' }}>
                  {wireDeadline
                    ? getDeadline(wireDeadline)
                    : signDeadline
                    ? getDeadline(signDeadline)
                    : 'No wire deadline has been set.'}
                </Typography>
              </SimpleBox>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default DealHeader;
