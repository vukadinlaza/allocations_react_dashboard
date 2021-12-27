import React, { useState } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@material-ui/icons/Edit';
import { Tooltip, Typography, Box, Container } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { CreateOutlined, VisibilityOutlined } from '@material-ui/icons';
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
  const [isEdit, setIsEdit] = useState(false);

  if (dealPageRedesign)
    return (
      <>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="flex-end">
            {!isEdit ? (
              <DealButton
                secondary
                onClick={() => setIsEdit(true)}
                icon={<CreateOutlined />}
                text="Edit"
                style={{ marginRight: '8px' }}
              />
            ) : (
              <DealButton
                onClick={() => setIsEdit(false)}
                secondary
                text="Discard Changes"
                style={{ marginRight: '8px' }}
              />
            )}
            <DealButton
              secondary
              onClick={goToDeal}
              icon={<VisibilityOutlined />}
              text="Preview"
              style={{ marginRight: '8px' }}
            />
            {isEdit && <DealButton text="Save" />}
          </Box>
        </Container>
        <DealLandingPageRedesign orgSlug={orgSlug} dealSlug={dealData.slug} isEdit={isEdit} />
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
