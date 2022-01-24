import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Typography, Button, Grid } from '@material-ui/core';
import DealLandingPageRedesign from '../../../../DealOneClick/LandingPageRedesign';

export default function DealPage({
  orgSlug,
  dealData,
  classes,
  goToDeal,
  goToEditDeal,
  handleLinkCopy,
}) {
  const { dealPageRedesign } = useFlags();

  if (dealPageRedesign)
    return (
      <DealLandingPageRedesign
        orgSlug={orgSlug}
        dealSlug={dealData.slug}
        goToDeal={goToDeal}
        dealPageRedesign={dealPageRedesign}
      />
    );

  return (
    <Grid item xs={10} className={classes.section}>
      <Typography className={classes.linkText}>
        dashboard.allocations.com
        {orgSlug && dealData.metadata.slug ? `/deals/${orgSlug}/${dealData.metadata.slug}` : ''}
      </Typography>
      <div className={classes.pageIcons}>
        <Button className={classes.outlinedButton} variant="outlined" onClick={goToEditDeal}>
          {' '}
          Edit Deal
        </Button>
        <Button className={classes.outlinedButton} variant="outlined" onClick={handleLinkCopy}>
          {' '}
          Copy Link{' '}
        </Button>
        <Button className={classes.containedButton} variant="contained" onClick={goToDeal}>
          {' '}
          View Deal{' '}
        </Button>
      </div>
    </Grid>
  );
}
