import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@material-ui/icons/Edit';
import { Tooltip, Typography, Box, Container } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { CreateOutlined, VisibilityOutlined } from '@material-ui/icons';
import { FlatBox } from '../../widgets';
import DealLandingPageRedesign from '../../../../DealOneClick/LandingPageRedesign/LandingPageRedesign';
import DealButton from '../../../../DealOneClick/LandingPageRedesign/DealButton';
import { useDealPage, useDealPageDispatch } from './DealPageContext';

export default function DealPage({
  orgSlug,
  dealData,
  classes,
  goToDeal,
  goToEditDeal,
  handleLinkCopy,
}) {
  const { dealPageRedesign } = useFlags();
  const { isEdit } = useDealPage();
  const dispatch = useDealPageDispatch();

  if (dealPageRedesign)
    return (
      <>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="flex-end">
            {!isEdit ? (
              <DealButton
                secondary
                onClick={() => dispatch({ type: 'edit', value: true })}
                icon={<CreateOutlined />}
                style={{ marginRight: '8px' }}
              >
                Edit
              </DealButton>
            ) : (
              <DealButton
                onClick={() => dispatch({ type: 'edit', value: false })}
                secondary
                style={{ marginRight: '8px' }}
              >
                Discard Changes
              </DealButton>
            )}
            <DealButton
              secondary
              onClick={goToDeal}
              icon={<VisibilityOutlined />}
              style={{ marginRight: '8px' }}
            >
              Preview
            </DealButton>
            {isEdit && <DealButton>Save</DealButton>}
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
