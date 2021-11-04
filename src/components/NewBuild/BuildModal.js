import React, { useState } from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import { useHistory } from 'react-router';
import spvIcon from '../../assets/spv-icon.svg';
import fundIcon from '../../assets/fund-icon.svg';

const useStyles = makeStyles((theme) => ({
  icon: {
    // mocks show 81px
    height: '72px',
    width: '72px',
    display: 'flex',
    justifyContent: 'center',
    margin: '0px 0px 15px 0px',
    borderRadius: '48px',
    padding: '12px',
    backgroundColor: '#ECF3FF',
  },
  modal: {
    display: 'flex',
    justifyContent: 'center',
  },
  modalPaperBody: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: '.5rem',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: 'none !important',
    cursor: 'pointer',
    border: 'solid #E5E5E5 1px',
    '&:hover': {
      boxShadow: '0px 5px 10px 2px rgba(225, 225, 225, .8) !important',
    },
  },
  modalPaperTitle: {
    marginTop: '8vh',
    borderRadius: '1rem 1rem 0 0 ',
    padding: '18px 29px',
    maxHeight: 'calc(100% - 8vh)',
    borderBottom: 'solid #E5E5E5 1px',
  },

  label: {
    color: '#2A2B54',
    fontWeight: 'bold',
  },
  typeBadge: {
    backgroundColor: '#ECF3FF',
    color: '#0461FF',
    fontSize: '13px',
    lineHeight: '16.41px',
    borderRadius: '4px',
    padding: '5px 10px',
  },
  typeBody: {
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '400',
    marginTop: '16px',
  },
  typeGrid: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: '5px 0px 25px 0px',
  },
  typeGroup: {
    width: '92.5%',
    margin: '20px',
    flexDirection: 'row',
  },
  typeTitle: {
    color: '#000',
    fontSize: '18px',
    fontWeight: '500',
  },
}));

const BuildModal = ({ onClose, isOpen }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Modal open={isOpen} onClose={onClose} className={classes.modal}>
      <Container maxWidth="sm">
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ height: '100%' }}>
            <Paper className={classes.modalPaperTitle} style={{ backgroundColor: '#186EFF' }}>
              <Grid container justifyContent="space-between">
                <Typography variant="h6" style={{ color: '#fff' }}>
                  Add New
                </Typography>
                <Box onClick={onClose} style={{ cursor: 'pointer' }}>
                  <CloseIcon htmlColor="#fff" />
                </Box>
              </Grid>
            </Paper>

            <Paper
              style={{
                backgroundColor: '#FBFCFF',
                borderRadius: '0 0 1rem 1rem',
              }}
            >
              <Grid container style={{ marginBottom: '25px' }}>
                <FormControl
                  component="fieldset"
                  style={{
                    width: '100%',
                    // height: '300px',  ?
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Grid container className={classes.typeGroup}>
                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'space-between',
                      }}
                    >
                      <Paper className={classes.modalPaperBody}>
                        <Grid
                          item
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '10px 10px 10px 5px',
                          }}
                        >
                          <div className={classes.icon}>
                            <img alt="spv-icon" src={spvIcon} />
                          </div>
                          <Typography className={classes.typeTitle}>SPV</Typography>
                        </Grid>
                        <Grid item className={classes.typeGrid}>
                          <Typography className={classes.typeBadge}>
                            From <span style={{ fontWeight: '700' }}>$8k</span>, paid by investors
                          </Typography>
                          <Typography className={classes.typeBody}>
                            A Special Purpose Vehicle (SPV) is a structure used to raise money to
                            invest in a single asset
                          </Typography>
                        </Grid>
                        <Grid item style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            type="submit"
                            style={{ width: '70%', borderRadius: '8px' }}
                            onClick={() => {
                              history.push(`/new-build-spv`);
                              onClose();
                            }}
                          >
                            Continue
                          </Button>
                        </Grid>
                      </Paper>

                      <Paper className={classes.modalPaperBody}>
                        <Grid
                          item
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '10px 10px 10px 5px',
                          }}
                        >
                          <div className={classes.icon}>
                            <img alt="fund-icon" src={fundIcon} />
                          </div>
                          <Typography className={classes.typeTitle}>Fund</Typography>
                        </Grid>
                        <Grid item className={classes.typeGrid}>
                          <Typography className={classes.typeBadge}>
                            From <span style={{ fontWeight: '700' }}>$15k</span>, paid by investors
                          </Typography>
                          <Typography className={classes.typeBody}>
                            A Fund is a structure used to raise money to invest in multiple assets
                            over a period of time
                          </Typography>
                        </Grid>
                        <Grid item style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            type="submit"
                            style={{ width: '70%', borderRadius: '8px' }}
                            onClick={() => {
                              history.push(`/new-build-fund`);
                              onClose();
                            }}
                          >
                            Continue
                          </Button>
                        </Grid>
                      </Paper>
                    </Box>
                  </Grid>
                </FormControl>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
};

export default BuildModal;
