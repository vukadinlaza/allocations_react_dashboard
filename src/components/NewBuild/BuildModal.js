import React from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
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

  return (
    <Modal open={isOpen} onClose={onClose} className={classes.modal}>
      <Container maxWidth="sm">
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ height: '100%' }}>
            <Paper className={classes.modalPaper} style={{ backgroundColor: '#186EFF' }}>
              <Grid container justifyContent="space-between">
                <Typography variant="h6" style={{ color: '#fff' }}>
                  Add New
                </Typography>
                <Box onClick={onClose} style={{ cursor: 'pointer' }}>
                  <CloseIcon htmlColor="#fff" />
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
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'space-between',
                        }}
                      >
                        {['SPV', 'Fund'].map((type) => {
                          return (
                            <Paper
                              style={{ textAlign: 'center', margin: '.5rem' }}
                              onClick={() => {
                                history.push(`/new-build-${type.toLowerCase()}`);
                                onClose();
                              }}
                            >
                              <Typography
                                style={{
                                  margin: '.5rem',
                                  fontWeight: '600',
                                  borderBottom: '2px solid black',
                                }}
                              >
                                {type}
                              </Typography>
                              <img
                                alt="some"
                                style={{ maxWidth: '100%', margin: '1rem' }}
                                src={
                                  type === 'SPV'
                                    ? 'https://allocations-public.s3.us-east-2.amazonaws.com/graphic-2.png'
                                    : 'https://allocations-public.s3.us-east-2.amazonaws.com/graphic-5.png'
                                }
                              />
                            </Paper>
                          );
                        })}
                      </Box>

                      {/* <Box style={{ display: 'flex', flexDirection: 'column' }}>
                        {['SPAC', 'Reg Cf'].map((type) => {
                          return (
                            <FormControlLabel
                              key={type}
                              value={type}
                              control={
                                <Radio
                                  color="primary"
                                  style={{ fontSize: '24px' }}
                                  classes={{
                                    root: classes.radio,
                                  }}
                                />
                              }
                              label={type}
                              classes={{
                                label: classes.label,
                              }}
                            />
                          );
                        })}
                      </Box> */}
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {/* <Grid container justifyContent="center">
                  <Button variant="contained" color="primary" size="large" style={{ width: '90%' }}>
                    Continue
                  </Button>
                </Grid> */}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
};

export default BuildModal;
