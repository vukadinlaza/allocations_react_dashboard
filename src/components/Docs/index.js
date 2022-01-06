import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

/** *
 *
 * Document upload/delete interface - used for DealEdit
 *
 * */

const ADD_INVESTMENT_DOC = gql`
  mutation AddInvestmentDoc($doc: Upload!, $investment_id: String!) {
    addInvestmentDoc(doc: $doc, investment_id: $investment_id)
  }
`;

const RM_INVESTMENT_DOC = gql`
  mutation RmInvestmentDoc($file: String!, $investment_id: String!) {
    rmInvestmentDoc(file: $file, investment_id: $investment_id)
  }
`;

export function Docs({ investment, setInvestment }) {
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [addInvestmentDoc, { data, loading, error }] = useMutation(ADD_INVESTMENT_DOC, {
    onError: () =>
      toast.error('Sorry, something went wrong. Try again or contact support@allocations.com'),
  });

  useEffect(() => {
    if (uploadedDoc) {
      addInvestmentDoc({ variables: { doc: uploadedDoc, investment_id: investment._id } });
    }
  }, [uploadedDoc]);

  useEffect(() => {
    if (data) {
      setInvestment((prev) => {
        return {
          ...prev,
          documents: [...prev.documents, data.addInvestmentDoc],
        };
      });
    }
  }, [data]);

  const docs = get(investment, 'documents', []);

  return (
    <div className="docs">
      <div className="doc-wrapper">
        <div className="add-doc">
          <label>
            <FontAwesomeIcon icon="plus" />
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={({ target }) => {
                if (target.validity.valid) setUploadedDoc(target.files[0]);
              }}
            />
          </label>
        </div>
        <div className="filename">&nbsp;</div>
      </div>
      {docs.map((doc) => (
        <Doc key={doc.path} doc={doc} investment={investment} />
      ))}
    </div>
  );
}

export function Doc({ doc, investment }) {
  const [done, setDone] = useState(false);
  const file = doc.path.split('/')[1];
  const [rmInvestmentDoc, { data }] = useMutation(RM_INVESTMENT_DOC, {
    variables: { file, investment_id: investment._id },
    onError: () => {
      toast.error('Something went wrong. Try again or contact support at support@allocations.com.');
    },
  });

  useEffect(() => {
    if (data) setDone(true);
  }, [data]);

  const rmDoc = () => {
    if (window.confirm(`Delete ${file}?`)) rmInvestmentDoc();
  };

  if (done) return null;

  return (
    <div className="doc-wrapper">
      <div className="doc">
        <FontAwesomeIcon icon="times-circle" onClick={rmDoc} />
        <FontAwesomeIcon icon={['far', 'file-pdf']} />
      </div>
      <div className="filename">
        <span>
          <a href={`https://${doc.link}`} target="_blank" rel="noreferrer">
            {file}
          </a>
        </span>
      </div>
    </div>
  );
}
