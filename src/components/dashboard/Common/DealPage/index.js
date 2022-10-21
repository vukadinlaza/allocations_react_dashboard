import React, { useState } from 'react';
import { MoreVertRounded } from '@material-ui/icons';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Typography, Button, Grid, Modal, Backdrop, Fade, Paper } from '@material-ui/core';
import moment from 'moment';
import { getMomentFromId } from '@allocations/nextjs-common';
import { useViewport } from '../../../../utils/hooks';
import { phone } from '../../../../utils/helpers';
import { ReactComponent as Eye } from '../../../../assets/eye.svg';
import { ReactComponent as CopyLink } from '../../../../assets/copy-icon.svg';
import { ReactComponent as Pencil } from '../../../../assets/pencil.svg';
import RemoteDealPage from '../../../RemoteDealPage';

const RoutingModal = ({ classes, open, handleClose, goToDeal, handleLinkCopy, goToEditDeal }) => {
  return (
    <Modal
      className={classes.modalContainer}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={open}>
        <Paper className={classes.routingModal}>
          <Grid className={classes.modalListItem} onClick={goToDeal}>
            <Eye alt="eye icon" className={classes.modalSVG} />
            <Typography> View Page </Typography>
          </Grid>
          <Grid className={classes.modalListItem} onClick={handleLinkCopy}>
            <CopyLink alt="document menu icon" className={classes.modalSVG} />
            <Typography> Copy Link </Typography>
          </Grid>
          <Grid className={classes.modalListItem} onClick={goToEditDeal}>
            <Pencil alt="pencil logo" className={classes.modalSVG} />
            <Typography> Edit Deal </Typography>
          </Grid>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default function DealPage({
  orgSlug,
  dealData,
  classes,
  goToDeal,
  goToEditDeal,
  handleLinkCopy,
}) {
  const { newDealPage } = useFlags();
  const { width } = useViewport();
  const [openModal, setOpenModal] = useState(false);
  const dealSlug = dealData?.metadata?.slug || dealData?.slug;

  const { deal: { _id: deal_id, status } = {} } = dealData;
  const isDealWhiteListed = newDealPage?.whiteListedDeals?.includes(deal_id);
  const isDealBlackListed = newDealPage?.blackListedDeals?.includes(deal_id);
  const minimumDate = moment(newDealPage?.minDealCreationDate, 'MMMM DD, YYYY');
  const dealCreationDate = getMomentFromId(deal_id);

  const isDealCreatedAfterMinDate = dealCreationDate.diff(minimumDate, 'minutes') >= 0;

  if (!isDealBlackListed && (isDealWhiteListed || isDealCreatedAfterMinDate)) {
    return <RemoteDealPage />;
  }

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <RoutingModal
        item
        xs={12}
        open={openModal}
        handleClose={handleClose}
        classes={classes}
        goToDeal={goToDeal}
        handleLinkCopy={handleLinkCopy}
        goToEditDeal={goToEditDeal}
      />
      <Grid item xs={10} className={classes.dealSection}>
        <Typography className={classes.linkText}>
          {window.origin}
          {orgSlug && dealSlug ? `/deals/${orgSlug}/${dealSlug}` : ''}
        </Typography>
        {width > phone ? (
          <div className={classes.pageIcons}>
            <Button
              className={classes.outlinedButton}
              variant="outlined"
              onClick={goToEditDeal}
              disabled={status === 'closed'}
            >
              Edit Deal
            </Button>
            <Button className={classes.outlinedButton} variant="outlined" onClick={handleLinkCopy}>
              Copy Link
            </Button>
            <Button className={classes.containedButton} variant="contained" onClick={goToDeal}>
              View Deal
            </Button>
          </div>
        ) : (
          <MoreVertRounded style={{ cursor: 'pointer' }} onClick={() => setOpenModal(true)} />
        )}
      </Grid>
    </>
  );
}
