import React, { useState, useEffect } from 'react';
import { Modal, Grid, Paper, Typography, Button } from '@material-ui/core';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import { makeStyles } from '@material-ui/core/styles';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { toast, ToastContainer } from 'react-toastify';
import W9Indivdual from './W9Individual/W9Individual';
import W9Entity from './W9Entity/W9Entity';
import W8BEN from './W8BEN/W8BEN';
import W8BENE from './W8BENE/W8BENE';
import './styles.scss';

const UPDATE_USER = gql`
  mutation submitTaxDocument($payload: Object) {
    submitTaxDocument(payload: $payload) {
      _id
    }
  }
`;

const KYCModal = ({ open, setOpen, kycTemplateId, kycTemplateName, investor, refetch }) => {
  const [submitTaxDocument] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      refetch();
      // setOpen(false);
      toast.success('Sucess! Tax form completed');
    },
  });
  // console.log('kyc templateName', kycTemplateName)
  // https://api.docspring.com/api/v1/templates/<TEMPLATE_ID>/submissions

  const createDoc = (formData) => {
    // TODO: handle form data submit and create DocSpring docs w/ Lance
    console.log('form submitted: ', formData);
    submitTaxDocument({ variables: { payload: { ...formData, kycTemplateId, kycTemplateName } } });
  };

  const getForm = (templateName) => {
    // TODO: use actual templateName to get correct form
    const formMap = {
      'W-9': <W9Indivdual toggleOpen={setOpen} createDoc={createDoc} />,
      'W-9-E': <W9Entity toggleOpen={setOpen} createDoc={createDoc} />,
      'W-8-BEN': <W8BEN toggleOpen={setOpen} createDoc={createDoc} />,
      'W-8-BEN-E': <W8BENE toggleOpen={setOpen} createDoc={createDoc} />,
    };

    // Change template name here for testing
    return formMap[templateName];
  };

  return (
    <Modal
      className="KYCModal"
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal"
      aria-describedby="modal"
    >
      <>
        <div className="form-container">{getForm(kycTemplateName)}</div>
      </>
    </Modal>
  );
};

export default KYCModal;
