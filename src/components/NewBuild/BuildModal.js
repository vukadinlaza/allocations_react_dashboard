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
    margin: '3px',
    borderRadius: '48px',
    padding: '12px',
    // weird with padding... 42px is sweet spot for rocket
    boxShadow: '0px 5px 10px 2px rgba(225, 225, 225, .8)',
  },
  modal: {
    display: 'flex',
    justifyContent: 'center',
  },
  modalPaperBody: {
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    margin: '.5rem',
    padding: '.5rem',
    borderRadius: '8px',
    boxShadow: 'none !important',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0px 5px 10px 2px rgba(225, 225, 225, .8) !important',
    },
  },
  modalPaperTitle: {
    marginTop: '8vh',
    borderRadius: '1rem 1rem 0 0 ',
    padding: theme.spacing(2),
    maxHeight: 'calc(100% - 8vh)',
    // overflow: 'scroll',
  },

  label: {
    color: '#2A2B54',
    fontWeight: 'bold',
  },
  // adjust mobile.
  typeBadge: {
    backgroundColor: '#ECF3FF',
    color: '#0461FF',
    fontSize: '14px',
    lineHeight: '16.41px',
    borderRadius: '44px',
    padding: '7px 12px',
    marginTop: '7px',
  },
  typeBody: {
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: '400',
  },
  typeGrid: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  typeGroup: {
    width: '92.5%',
    margin: '20px',
    flexDirection: 'row',
  },
  typeTitle: {
    color: '#186EFF',
    fontSize: '18px',
    fontWeight: '500',
  },
}));

const BuildModal = ({ onClose, isOpen }) => {
  const classes = useStyles();
  const history = useHistory();
  const [typeSelected, setTypeSelected] = useState('');

  return (
    <Modal open={isOpen} onClose={onClose} className={classes.modal}>
      <Container maxWidth="sm">
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ height: '100%' }}>
            <Paper className={classes.modalPaperTitle} style={{ backgroundColor: '#fff' }}>
              <Grid container justifyContent="space-between">
                <Typography variant="h6" style={{ color: '#000' }}>
                  Add New
                </Typography>
                <Box onClick={onClose} style={{ cursor: 'pointer' }}>
                  <CloseIcon htmlColor="#000" />
                </Box>
              </Grid>
            </Paper>

            <Paper
              style={{
                backgroundColor: '#fff',
                borderRadius: '0 0 1rem 1rem',
              }}
            >
              <Grid container style={{ marginBottom: '25px' }}>
                <FormControl component="fieldset" style={{ width: '100%' }}>
                  <Grid container className={classes.typeGroup}>
                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'space-between',
                      }}
                    >
                      <Paper
                        className={classes.modalPaperBody}
                        onClick={() => setTypeSelected('spv')}
                        style={
                          typeSelected === 'spv'
                            ? { border: 'solid #0461FF 2px' }
                            : { border: 'solid #E5E5E5 1px' }
                        }
                      >
                        <Grid
                          item
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '10px 10px 10px 5px',
                          }}
                        >
                          <img alt="spv-icon" className={classes.icon} src={spvIcon} />

                          <Typography className={classes.typeTitle}>SPV</Typography>
                        </Grid>
                        <Grid item className={classes.typeGrid}>
                          <Typography className={classes.typeBody}>
                            A Special Purpose Vehicle (SPV) is a structure used to raise money to
                            invest in a single asset
                          </Typography>
                          <Typography className={classes.typeBadge}>
                            From <span style={{ fontWeight: '700' }}>$8k</span>, paid by investors
                          </Typography>
                        </Grid>
                      </Paper>

                      <Paper
                        className={classes.modalPaperBody}
                        onClick={() => setTypeSelected('fund')}
                        style={
                          typeSelected === 'fund'
                            ? { border: 'solid #0461FF 2px' }
                            : { border: 'solid #E5E5E5 1px' }
                        }
                      >
                        <Grid
                          item
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '10px 10px 10px 5px',
                          }}
                        >
                          <img alt="fund-icon" className={classes.icon} src={fundIcon} />
                          <Typography className={classes.typeTitle}>Fund</Typography>
                        </Grid>
                        <Grid item className={classes.typeGrid}>
                          <Typography className={classes.typeBody}>
                            A Fund is a structure used to raise money to invest in multiple assets
                            over a period of time
                          </Typography>
                          <Typography className={classes.typeBadge}>
                            From <span style={{ fontWeight: '700' }}>$15k</span>, paid by investors
                          </Typography>
                        </Grid>
                      </Paper>
                    </Box>
                    {/* </RadioGroup> */}
                  </Grid>
                  <Grid container justifyContent="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      type="submit"
                      style={{ width: '90%', borderRadius: '8px' }}
                      onClick={() => {
                        history.push(`/new-build-${typeSelected}`);
                        onClose();
                      }}
                    >
                      Next
                    </Button>
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
