import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Tooltip } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import { phone } from '../../../../utils/helpers';

const styles = (theme) => ({
  box: {
    width: '100%',
    height: '60px',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    [theme.breakpoints.down(phone)]: {
      minWidth: '0 !important',
      maxWidth: 'none !important',
      height: '100%',
    },
  },
  boxTitle: {
    fontSize: '14px',
    color: '#64748B',
    [theme.breakpoints.down(phone)]: {
      fontSize: '14px',
      display: 'flex',
    },
  },
  boxTitleContainer: {
    width: '220px',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down(phone)]: {
      width: '120px',
      fontSize: '14px',
      display: 'inline-block',
      alignSelf: 'flex-end',
      top: '0',
    },
  },

  boxTitleText: {
    display: 'flex',
    alignItems: 'start',
  },
  closeModal: {
    right: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    fontSize: '14px',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  fixedBoxContent: {
    height: 'calc(100% - 71px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  infoIcon: {
    marginLeft: '0.2em',
    cursor: 'pointer',
    color: '#64748B',
    fontSize: '16px',
    [theme.breakpoints.down(phone)]: {
      marginLeft: '5px',
    },
  },

  modal: {
    padding: '20px',
  },

  modalBackground: {
    position: 'fixed',
    left: '0',
    top: '0',
    height: '100vh',
    width: '100vw',
    zIndex: '1099',
    backgroundColor: 'rgba(26, 26, 26, 0.30)',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: '1.2em',
  },
  modalTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '15px',
  },
  tooltip: {
    fontSize: '14px',
    zIndex: '2000',
    background: 'white',
    color: 'black',
  },
});

export const ModalTooltip = withStyles(styles)(
  ({ classes, children, title, handleTooltip, tooltipContent, openTooltip, id }) => {
    return (
      <>
        {openTooltip === id && (
          <div className={classes.modalBackground} onClick={() => handleTooltip('')} />
        )}
        <Tooltip
          interactive
          title={
            <div className={classes.modal}>
              <div className={classes.modalTitleContainer}>
                <Typography className={classes.modalTitle}>{title}</Typography>
                <Typography className={classes.closeModal} onClick={() => handleTooltip('')}>
                  Close
                  <CloseIcon style={{ fontSize: '14px' }} />
                </Typography>
              </div>
              {tooltipContent}
            </div>
          }
          open={openTooltip === id}
          disableHoverListener
          classes={{
            popper: classes.popper,
            tooltip: classes.tooltip,
          }}
        >
          {children}
        </Tooltip>
      </>
    );
  },
);

export const InvestingDetailsSimpleBox = withStyles(styles)(
  ({
    classes,
    title,
    autoHeight,
    fontSize,
    fullWidthContent,
    children,
    openTooltip,
    handleTooltip,
    id,
    tooltipContent,
  }) => {
    return (
      <div className={`${classes.box} ${autoHeight ? classes.dynamicHeight : ''}`}>
        <div className={classes.boxTitleContainer} style={{ justifyContent: 'space-between' }}>
          <div className={classes.boxTitleText}>
            <Typography
              className={classes.boxTitle}
              style={fontSize === 'small' ? { fontSize: '14px' } : {}}
            >
              {title}
            </Typography>
            {tooltipContent && (
              <ModalTooltip
                title={title}
                handleTooltip={handleTooltip}
                tooltipContent={tooltipContent}
                openTooltip={openTooltip}
                id={id}
              >
                <HelpIcon className={classes.infoIcon} onClick={() => handleTooltip(id)} />
              </ModalTooltip>
            )}
          </div>
        </div>
        <div
          className={`${classes.boxContent} ${
            autoHeight ? classes.dynamicBoxContent : classes.fixedBoxContent
          }`}
          style={fullWidthContent ? { padding: 0 } : {}}
        >
          {children}
        </div>
      </div>
    );
  },
);
