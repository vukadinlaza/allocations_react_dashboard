import { Backdrop, Fade, Modal, Button } from '@material-ui/core';
import React from 'react';

import CloseIcon from '@material-ui/icons/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.scss';

function WireInstructionsModal({ open, setOpen, docs, investmentWireInstructions = {} }) {
  let link =
    docs && docs.find((d) => d.path.includes('instructions'))
      ? `https://${docs.find((d) => d.path.includes('instructions')).link}`
      : null;

  if (investmentWireInstructions?.link) {
    link = `https://${investmentWireInstructions.link}`;
  }

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className="WireInstructionsModal"
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
          <Button onClick={handleClose} className="close-button">
            <CloseIcon />
          </Button>
        </div>
      </Fade>
    </Modal>
  );
}

export default WireInstructionsModal;
