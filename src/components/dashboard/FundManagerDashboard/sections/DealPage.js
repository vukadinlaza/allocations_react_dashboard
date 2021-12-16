import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@material-ui/icons/Edit';
import { Tooltip, Typography, Box, Container } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { HiOutlinePencil, HiOutlineEye } from 'react-icons/hi';
import { FlatBox } from '../widgets';
import DealLandingPageRedesign from '../../../DealOneClick/LandingPageRedesign/LandingPageRedesign';
import DealButton from '../../../DealOneClick/LandingPageRedesign/DealButton';

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
      <>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="flex-end">
            <DealButton
              onClick={goToEditDeal}
              icon={<HiOutlinePencil color="#64748B" />}
              text="Edit"
              style={{ marginRight: '8px' }}
            />
            <DealButton onClick={goToDeal} icon={<HiOutlineEye color="#64748B" />} text="Preview" />
          </Box>
        </Container>
        <DealLandingPageRedesign orgSlug={orgSlug} dealSlug={dealData.slug} />
      </>
    );

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
