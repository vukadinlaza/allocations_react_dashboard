import { Backdrop, Fade, Modal } from '@material-ui/core';
import React from 'react'
import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.scss'

function WireInstructionsModal({ open, setOpen, docs }) {

  const link =
    docs && docs.find((d) => d.path === 'wire-instructions')
      ? `https://${docs.find((d) => d.path === 'wire-instructions').link}`
      : null;

  if(!link) {
    return (
      <div className="wire" style={{ padding: '20px' }}>
        Contact For Wire Details
      </div>
    );
  }

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className='WireInstructionsModal'
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className="wire-doc-iframe">
          <p className="label">Wire Instructions</p>
          <div className="wire-link">
            <div style={{ marginBottom: '15px' }}>
              <FontAwesomeIcon icon={['far', 'file-pdf']} />
              <a href={link} target="_blank" rel="noopener noreferrer">
                {' '}
              Open in new tab
            </a>
            </div>
          </div>
          <div className="embed-responsive embed-responsive-1by1">
            <iframe className="embed-responsive-item" title="Onboarding Document" src={link} />
          </div>
          <Button onClick={handleClose} className="close-button"><CloseIcon /></Button>
        </div>
      </Fade>
    </Modal>
  );
}

export default WireInstructionsModal