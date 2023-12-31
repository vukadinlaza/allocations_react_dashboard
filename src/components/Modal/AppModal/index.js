import React from 'react';
import { Container, Modal, Typography, Grid, Paper, Box } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    justifyContent: 'center',
  },
  modalPaper: {
    marginTop: '8vh',
    borderRadius: '1rem',
    padding: theme.spacing(2),
    maxHeight: 'calc(100% - 8vh)',
    overflow: 'scroll',
  },
  modalHeader: {
    fontFamily: 'Roboto !important',
  },
}));

const AppModal = ({ isOpen, onClose, children, modalHeader, maxWidth = 'sm' }) => {
  const classes = useStyles();
  return (
    <Modal open={isOpen} onClose={onClose} className={classes.modal}>
      <Container maxWidth={maxWidth}>
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ height: '100%' }}>
            <Paper className={classes.modalPaper}>
              <Grid container justifyContent={modalHeader ? 'space-between' : 'flex-end'}>
                {modalHeader && <Typography>{modalHeader}</Typography>}
                <Box onClick={onClose} style={{ cursor: 'pointer' }}>
                  <CloseIcon />
                </Box>
              </Grid>
              <Grid container justifyContent="center">
                {children}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
};

export default AppModal;
