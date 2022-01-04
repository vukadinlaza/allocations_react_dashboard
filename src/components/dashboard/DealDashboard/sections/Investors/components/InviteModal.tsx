import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Modal, Backdrop, Fade, Button, Paper, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CancelIcon from '@material-ui/icons/Cancel';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import styles from '../../../styles';
import { validateEmail } from '../../../../../../utils/helpers';
import { toast } from 'react-toastify';
import classNames from 'classnames';
interface Props extends WithStyles<typeof styles> {
  orgSlug: string;
  dealId: string;
}

// interface CustomCloseButtonProps {
//   closeToast: () => void;
// }

// const CustomCloseButton: React.ReactElement<CustomCloseButtonProps> = ({ closeToast }) => (
//   <button onClick={closeToast}>X</button>
// );

const SEND_INVITATIONS = gql`
  mutation SendInvitations($dealId: String!, $emails: [String]) {
    sendInvitations(dealId: $dealId, emails: $emails)
  }
`;

const InviteModal: React.FC<Props> = ({ classes, orgSlug, dealId }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [emails, setEmails] = useState<Array<string>>([]);
  const [error, setError] = useState('');
  const [emailsSent, setEmailsSent] = useState(false);
  const [sendInvitations] = useMutation(SEND_INVITATIONS, {
    onCompleted: (res) => {
      if (res.sendInvitations.emailsSent) {
        setInputValue('');
        setEmails([]);
        setError('');
        setEmailsSent(true);
      }
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = e.currentTarget.value;
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
  };

  const handleInviteMore = () => {
    setEmailsSent(false);
  };

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
            {!emailsSent ? (
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
                    inputProps={{
                      style: { padding: '14.5px 14px', background: 'white' },
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
                  disabled={!emails.length}
                  className={!emails.length ? classes.inviteButtonDisabled : classes.inviteButton}
                  style={{ width: '100%', marginTop: '40px' }}
                  onClick={sendEmails}
                >
                  Invite
                </Button>
                <Button className={classes.copyLink} disableRipple onClick={handleCopyLink}>
                  <FileCopyOutlinedIcon style={{ marginRight: '8px' }} /> Copy Link
                </Button>
              </div>
            ) : (
              <div className={classes.modalContentContainer}>
                <span className={classes.avatarBackground}>
                  <MailOutlineIcon className={classes.personAdd} />
                </span>
                <p className={classes.modalSubtitle} style={{ margin: 0 }}>
                  Invitation emails sent!
                </p>
                <Button
                  className={classes.inviteButton}
                  style={{ width: '100%', marginTop: '40px' }}
                  onClick={handleClose}
                >
                  Okay
                </Button>
                <Button className={classes.copyLink} disableRipple onClick={handleInviteMore}>
                  Invite More
                </Button>
              </div>
            )}
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

export default withStyles(styles)(InviteModal);
