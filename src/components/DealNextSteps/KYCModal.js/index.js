import React from 'react';
import { Modal } from '@material-ui/core';
import { useMutation, gql } from '@apollo/client';
import { toast } from 'react-toastify';
import W9Indivdual from './W9Individual/W9Individual';
import W9Entity from './W9Entity/W9Entity';
import W8BEN from './W8BEN/W8BEN';
import W8BENE from './W8BENE/W8BENE';
import './styles.scss';

const UPDATE_USER = gql`
  mutation submitTaxDocument($payload: Object) {
    submitTaxDocument(payload: $payload) {
      _id
      documents
    }
  }
`;

const KYCModal = ({ open, setOpen, kycTemplateId, kycTemplateName, refetch, deal, setShowTaxAsCompleted }) => {
  const [submitTaxDocument, { called, loading }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      const { submitTaxDocument } = data;
      refetch();
      if (
        submitTaxDocument?.documents.find((doc) => doc.documentName.includes('W-9') || doc.documentName.includes('W-8'))
      ) {
        toast.success('Success! Tax form completed.');
      } else {
        toast.error('Sorry, Something went wrong. Try again or contact support@allocations.com');
      }
      setOpen(false);
      setShowTaxAsCompleted(true);
      setTimeout(() => {
        refetch();
      }, 3000);
    },
    onError: () => {
      toast.error('Sorry, Something went wrong. Try again or contact support@allocations.com');
    },
  });

  const createDoc = (formData) => {
    // TODO: handle form data submit and create DocSpring docs w/ Lance
    submitTaxDocument({
      variables: { payload: { ...formData, kycTemplateId, kycTemplateName, isDemo: deal.isDemo === true } },
    });
  };

  const getForm = (templateName) => {
    // TODO: use actual templateName to get correct form
    const formMap = {
      'W-9': <W9Indivdual called={called} loading={loading} toggleOpen={setOpen} createDoc={createDoc} />,
      'W-9-E': <W9Entity called={called} loading={loading} toggleOpen={setOpen} createDoc={createDoc} />,
      'W-8-BEN': <W8BEN called={called} loading={loading} toggleOpen={setOpen} createDoc={createDoc} />,
      'W-8-BEN-E': <W8BENE called={called} loading={loading} toggleOpen={setOpen} createDoc={createDoc} />,
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
      <div className="form-container">{getForm(kycTemplateName)}</div>
    </Modal>
  );
};

export default KYCModal;
