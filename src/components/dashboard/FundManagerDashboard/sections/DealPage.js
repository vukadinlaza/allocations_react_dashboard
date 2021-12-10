import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@material-ui/icons/Edit';
import { Tooltip, Typography } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { FlatBox } from '../widgets';
import DealLandingPageRedesign from '../../../DealOneClick/LandingPageRedesign/LandingPageRedesign';

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
    return <DealLandingPageRedesign orgSlug={orgSlug} dealSlug={dealData.slug} />;

  return (
    <div className={classes.section}>
      <FlatBox title="SHARE">
        <Typography>
          dashboard.allocations.com
          {orgSlug && dealData?.slug ? `/deals/${orgSlug}/${dealData.slug}` : ''}
        </Typography>
        <div className={classes.pageIcons}>
          <div className={classes.pageIcon} onClick={goToEditDeal}>
            <Tooltip title="Edit">
              <EditIcon />
            </Tooltip>
          </div>
          <div className={classes.pageIcon} onClick={goToDeal}>
            <Tooltip title="Go">
              <ChevronRightIcon />
            </Tooltip>
          </div>
          <div className={classes.pageIcon} onClick={handleLinkCopy}>
            <Tooltip title="Copy">
              <FileCopyOutlinedIcon />
            </Tooltip>
          </div>
        </div>
      </FlatBox>
    </div>
  );
}
