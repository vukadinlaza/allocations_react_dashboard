import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Tooltip, Button, Grid } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import { phone, tablet } from '../../../utils/helpers';

const styles = (theme) => ({
  box: {
    width: '100%',
    height: '199px',
    background: '#FBFCFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #8493A640',
    borderRadius: '10px',
    // marginBottom: "20px",
    [theme.breakpoints.down(phone)]: {
      // width: "100vw",
      minWidth: '0 !important',
      maxWidth: 'none !important',
    },
  },
  boxContent: {
    padding: '16px',
  },
  boxTitle: {
    fontSize: '20px',
    // whiteSpace: "nowrap",
    // overflow: "hidden",
    // textOverflow: "ellipsis",
  },
  boxTitleContainer: {
    width: '100%',
    height: '71px',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    borderBottom: '1px solid #8493A640',
    borderRadius: '10px 10px 0px 0px',
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
  },
  boxTitleText: {
    display: 'flex',
    alignItems: 'center',
  },
  chartBox: {
    // minWidth: '430px',
    // maxWidth: '49%',
    height: '450px',
    [theme.breakpoints.down(tablet)]: {
      height: 'auto',
    },
  },
  chartBoxContent: {
    height: 'calc(100% - 71px)',
    padding: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    '& *': {
      color: theme.palette.text.secondary,
    },
    [theme.breakpoints.down(tablet)]: {
      flexWrap: 'wrap',
    },
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
  dynamicBoxContent: {
    height: 'calc(100% - 110px)',
  },
  dynamicHeight: {
    // height: "auto"
    height: '100%',
  },
  fixedBoxContent: {
    height: 'calc(100% - 71px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  flatBoxContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down(phone)]: {
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  },
  infoIcon: {
    marginLeft: '0.5em',
    cursor: 'pointer',
    color: '#205DF5',
    fontSize: '20px',
  },
  listButton: {
    backgroundColor: '#2A2B54',
    color: 'white',
    width: '100%',
    textTransform: 'none',
    bottom: '3rem',
    height: '3rem',
    borderRadius: '0px 0px 10px 10px',
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
  scrollableBox: {
    height: '635px',
    // height: "620px"
  },
  scrollableBoxContent: {
    height: 'calc(100% - 71px)',
    // height: "calc(100% - 130px)",
    overflowY: 'scroll',
    overflowX: 'hidden',
    // marginBottom: "10px"
  },
  tooltip: {
    fontSize: '14px',
    zIndex: '2000',
    background: 'white',
    color: 'black',
  },
});

const getDimensions = (size) => {
  switch (size) {
    case 'full':
      return { minWidth: '100%' };
    case 'half':
      return { minWidth: '430px', maxWidth: '49%' };
    case 'third':
      return { minWidth: '430px', maxWidth: '32%' };
    case 'fourth':
      return { minWidth: '265px', maxWidth: '24%' };
    // return {minWidth: '300px', maxWidth: '24%'};
    default:
      return {};
  }
};

export const ModalTooltip = withStyles(styles)(
  ({ classes, children, title, handleTooltip, tooltipContent, openTooltip, id }) => {
    return (
      <>
        {openTooltip === id && (
          <div className={classes.modalBackground} onClick={(e) => handleTooltip('')} />
        )}
        <Tooltip
          interactive
          title={
            <div className={classes.modal}>
              <div className={classes.modalTitleContainer}>
                <Typography className={classes.modalTitle}>{title}</Typography>
                <Typography className={classes.closeModal} onClick={(e) => handleTooltip('')}>
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

export const SimpleBox = withStyles(styles)(
  ({
    classes,
    title,
    size,
    autoHeight,
    titleData,
    fontSize,
    buttonAction,
    buttonText,
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
                <HelpIcon className={classes.infoIcon} onClick={(e) => handleTooltip(id)} />
              </ModalTooltip>
            )}
          </div>
          <div>{titleData}</div>
        </div>
        <div
          className={`${classes.boxContent} ${
            autoHeight ? classes.dynamicBoxContent : classes.fixedBoxContent
          }`}
          style={fullWidthContent ? { padding: 0 } : {}}
        >
          {children}
        </div>
        {buttonText ? (
          <Button variant="contained" className={classes.listButton} onClick={buttonAction}>
            {buttonText}
          </Button>
        ) : (
          ''
        )}
      </div>
    );
  },
);

export const ChartBox = withStyles(styles)(({ classes, title, info, children }) => {
  return (
    <div className={`${classes.box} ${classes.chartBox}`}>
      <div className={classes.boxTitleContainer}>
        <Typography className={classes.boxTitle}>{title}</Typography>
        {false && (
          <Tooltip
            title={info}
            classes={{
              tooltip: classes.tooltip,
            }}
          >
            <HelpIcon className={classes.infoIcon} />
          </Tooltip>
        )}
      </div>
      <div className={`${classes.boxContent} ${classes.chartBoxContent}`}>{children}</div>
    </div>
  );
});

export const FlatBox = withStyles(styles)(({ classes, title, info, children }) => {
  return (
    <div className={classes.box} style={{ width: '100%', height: 'auto', minHeight: '120px' }}>
      <div className={classes.boxTitleContainer} style={{ height: '60px' }}>
        <Typography className={classes.boxTitle} style={{ fontSize: '14px' }}>
          {title}
        </Typography>
        {info ? (
          <Tooltip
            title={info}
            classes={{
              tooltip: classes.tooltip,
            }}
          >
            <HelpIcon className={classes.infoIcon} />
          </Tooltip>
        ) : (
          ''
        )}
      </div>
      <div className={`${classes.boxContent} ${classes.flatBoxContent}`}>{children}</div>
    </div>
  );
});

export const ScrollableBox = withStyles(styles)(
  ({
    classes,
    title,
    size,
    titleData,
    fontSize,
    buttonAction,
    buttonText,
    fullWidthContent,
    children,
  }) => {
    return (
      <div className={`${classes.box} ${classes.scrollableBox}`}>
        <div className={classes.boxTitleContainer} style={{ justifyContent: 'space-between' }}>
          <div className={classes.boxTitleText}>
            <Typography
              className={classes.boxTitle}
              style={fontSize === 'small' ? { fontSize: '14px' } : {}}
            >
              {title}
            </Typography>
          </div>
          <div>{titleData}</div>
        </div>
        <div
          className={`${classes.boxContent} ${classes.scrollableBoxContent}`}
          style={fullWidthContent ? { padding: 0 } : {}}
        >
          {children}
        </div>
        {buttonText ? (
          <Button variant="contained" className={classes.listButton} onClick={buttonAction}>
            {buttonText}
          </Button>
        ) : (
          ''
        )}
      </div>
    );
  },
);
