import React, { useState } from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { useHistory } from 'react-router';
import spvIcon from '../../assets/spv-icon.svg';
import fundIcon from '../../assets/fund-icon.svg';

const useStyles = makeStyles((theme) => ({
  icon: {
    maxWidth: '100%',
    margin: '1rem',
    border: 'solid pink 1px',
    radius: '48px',
  },
  modal: {
    display: 'flex',
    justifyContent: 'center',
  },
  modalPaper: {
    marginTop: '8vh',
    borderRadius: '1rem 1rem 0 0 ',
    padding: theme.spacing(2),
    maxHeight: 'calc(100% - 8vh)',
    // overflow: 'scroll',
  },
  modalHeader: {
    fontFamily: 'Roboto !important',
  },
  label: {
    color: '#2A2B54',
    fontWeight: 'bold',
  },
  radioGroup: {
    margin: '25px',
    flexDirection: 'row',
  },
  radio: {
    color: '#186EFF',
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
            <Paper className={classes.modalPaper} style={{ backgroundColor: '#fff' }}>
              <Grid container justifyContent="space-between">
                <Typography variant="h6" style={{ color: '#000' }}>
                  Add New
                </Typography>
                <Box onClick={onClose} style={{ cursor: 'pointer' }}>
                  <CloseIcon htmlColor="#000" />
                </Box>
              </Grid>
            </Paper>

            <Paper style={{ backgroundColor: '#fff', borderRadius: '0 0 1rem 1rem' }}>
              <Grid container style={{ marginBottom: '25px' }}>
                <Grid item style={{ width: '100%' }}>
                  <FormControl component="fieldset" style={{ width: '100%' }}>
                    <RadioGroup className={classes.radioGroup}>
                      <Box
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          alignItems: 'space-between',
                        }}
                      >
                        <Paper
                          key="spv"
                          style={{ textAlign: 'center', margin: '.5rem', padding: '.5rem' }}
                        >
                          <img alt="spv-icon" className={classes.icon} src={spvIcon} />

                          <Typography
                            style={{
                              margin: '.5rem',
                              fontWeight: '600',
                            }}
                          >
                            Fund
                          </Typography>
                          <Typography
                            style={{
                              margin: '.5rem',
                              fontSize: '.7rem',
                            }}
                          >
                            A Special Purpose Vehicle (SPV) is a structure used to raise money to
                            invest in a single asset
                          </Typography>
                        </Paper>

                        <Paper
                          key="fund"
                          style={{ textAlign: 'center', margin: '.5rem', padding: '.5rem' }}
                        >
                          <img alt="fund-icon" className={classes.icon} src={fundIcon} />

                          <Typography
                            style={{
                              margin: '.5rem',
                              fontWeight: '600',
                            }}
                          >
                            Fund
                          </Typography>
                          <Typography
                            style={{
                              margin: '.5rem',
                              fontSize: '.7rem',
                            }}
                          >
                            A Fund is a structure used to raise money to invest in multiple assets
                            over a period of time
                          </Typography>
                        </Paper>
                      </Box>
                    </RadioGroup>
                    <Grid container justifyContent="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                        style={{ width: '90%' }}
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
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
};

export default BuildModal;
