import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import {
  Modal,
  Backdrop,
  Fade,
  Button,
  Paper,
  TextField,
  CircularProgress,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CancelIcon from '@material-ui/icons/Cancel';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { toast } from 'react-toastify';
import styles from '../../../styles';
import { validateEmail } from '../../../../../../utils/helpers';

export interface Props extends WithStyles<typeof styles> {
  orgSlug: string;
  dealId: string;
  dealProgressTask?: boolean;
}

const SEND_INVITATIONS = gql`
  mutation SendInvitations($dealId: String!, $emails: [String]) {
    sendInvitations(dealId: $dealId, emails: $emails)
  }
`;

const UPDATE_DEAL_TASK = gql`
  mutation UpdateInviteInvestorsTask($dealId: String!) {
    updateInviteInvestorsTask(dealId: $dealId)
  }
`;

const InviteModal: React.FC<Props> = ({ classes, orgSlug, dealId, dealProgressTask = false }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [emails, setEmails] = useState<Array<string>>([]);
  const [error, setError] = useState('');
  const [emailsSent, setEmailsSent] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [sendInvitations, { loading }] = useMutation(SEND_INVITATIONS, {
    onCompleted: (res) => {
      if (res.sendInvitations.emailsSent) {
        setInputValue('');
        setEmails([]);
        setError('');
        setEmailsSent(true);
      }
      toast.success('Emails successfully sent!');
    },
  });

  const [updateInviteInvestorsTask] = useMutation(UPDATE_DEAL_TASK, {
    onError: (err) => {
      console.log('Error:', err);
    },
  });

  const handleOpen = () => {
    setOpen(true);
    setDisabled(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = e.currentTarget;
    if (![',', 'Enter', ' '].includes(value.charAt(value.length - 1))) {
      setInputValue(value);
    }
  };

  const updateEmails = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ([',', 'Enter', ' '].includes(e.key)) {
      if (!validateEmail(inputValue)) {
        setError('Invalid email address');
        return;
      }
      if (emails.includes(inputValue)) {
        setError('Email already added');
        return;
      }
      if (error) setError('');
      const emailsCopy: string[] = emails.map((e) => e);
      emailsCopy.push(inputValue);
      setInputValue('');
      setEmails(emailsCopy);
    }
  };

  const removeEmail = (email: string) => {
    const emailsCopy: string[] = emails.filter((e) => e !== email);
    setEmails(emailsCopy);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.origin + (`/admin/${orgSlug}/${dealId}` || ''));
    toast('Copied to Clipboard', {
      position: 'bottom-center',
      className: classes.toast,
      bodyClassName: classes.toastBody,
    });
  };

  const sendEmails = () => {
    if (!emails.length) {
      console.log('No emails to send invitations');
      return;
    }
    sendInvitations({
      variables: {
        dealId,
        emails,
      },
    });
    if (dealProgressTask) {
      updateInviteInvestorsTask({
        variables: {
          dealId,
        },
      });
    }
  };

  // const handleInviteMore = () => {
  //   setEmailsSent(false);
  // };

  // Once emails have been sent and we are on the Invite Investors task,
  // we render a spinner so that the modal is unavailable
  if (dealProgressTask && (loading || emailsSent)) return <CircularProgress />;

  return (
    <>
      <Button className={classes.inviteButton} disableRipple onClick={handleOpen}>
        Invite
      </Button>
      <Modal
        className={classes.modalContainer}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          classes: {
            root: classes.backdrop,
          },
        }}
      >
        <Fade in={open}>
          <Paper className={classes.modal} style={{ minHeight: emailsSent ? '344px' : '432px' }}>
            <div className={classes.modalTitleContainer}>
              <span className={classes.modalTitle}>Invite</span>
              <CloseIcon className={classes.closeModal} onClick={handleClose} />
            </div>

            <div className={classes.modalContentContainer}>
              <span className={classes.avatarBackground}>
                <PersonAddIcon className={classes.personAdd} />
              </span>
              <p className={classes.modalSubtitle}>Invite Investors</p>
              <div className={classes.emailsInput}>
                <TextField
                  variant="outlined"
                  placeholder="Enter investor emails here..."
                  className={classes.textFieldRoot}
                  InputLabelProps={{ style: { top: '-4px' } }}
                  onChange={handleChange}
                  value={inputValue || ''}
                  InputProps={{
                    classes: { input: classes.input, root: classes.inputRoot },
                  }}
                  onKeyPress={updateEmails}
                />
                {error && <p className={classes.error}>{error}</p>}
              </div>
              {emails.length ? (
                <div className={classes.emailsContainer}>
                  {emails.map((email) => (
                    <span className={classes.emailTag} key={uuidv4()}>
                      <span className={classes.emailTagText}>{email}</span>
                      <CancelIcon
                        className={classes.emailTagCancel}
                        onClick={() => removeEmail(email)}
                      />
                    </span>
                  ))}
                </div>
              ) : (
                ''
              )}
              <Button
                disabled={!emails.length || disabled}
                className={!emails.length ? classes.inviteButtonDisabled : classes.inviteButton}
                style={{ width: '100%', marginTop: '40px' }}
                onClick={() => {
                  setOpen(false);
                  sendEmails();
                  setDisabled(true);
                }}
              >
                Invite
              </Button>
              <Button className={classes.copyLink} disableRipple onClick={handleCopyLink}>
                <FileCopyOutlinedIcon style={{ marginRight: '8px' }} /> Copy Link
              </Button>
            </div>

            {/* // : (
            //   <div className={classes.modalContentContainer}>
            //     <span className={classes.avatarBackground}>
            //       <MailOutlineIcon className={classes.personAdd} />
            //     </span>
            //     <p className={classes.modalSubtitle} style={{ margin: 0 }}>
            //       Invitation emails sent!
            //     </p>
            //     <Button
            //       className={classes.inviteButton}
            //       style={{ width: '100%', marginTop: '40px' }}
            //       onClick={handleClose}
            //     >
            //       Okay
            //     </Button>
            //     <Button className={classes.copyLink} disableRipple onClick={handleInviteMore}>
            //       Invite More
            //     </Button>
            //   </div>
            // )} */}
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

export default withStyles(styles)(InviteModal);
