import React from 'react';
import Loader from '../../../utils/Loader';
// import _ from 'lodash';
// import moment from 'moment';

// on INDEX, if there is no, investor.documents, don't render this tab?
const DocumentsTab = ({ classes, dealInvestments }) => {
  console.log('Deal', dealInvestments);

  const documentsData = dealInvestments?.deal?.investments?.map((investment) => {
    return {
      investorId: investment.investor?._id,
      name: investment.investor?.name,
      status: investment.status,
      // add Date Signed,
      documents: investment.documents?.map((doc) => {
        return doc.path;
      }),
    };
  });
  console.log('Docs', documentsData);

  if (!dealInvestments) return <Loader />;

  return (
    <>
      <p>Documents</p>
    </>
  );
};

export default DocumentsTab;
