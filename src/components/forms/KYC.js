import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Paper, Tooltip } from '@material-ui/core';
import { colors } from '@allocations/design-system';
import { toast } from 'react-toastify';
import { useSimpleReducer } from '../../utils/hooks';

const UPDATE_USER = gql`
  mutation UpdateUser($investor: UserInput!) {
    updateUser(input: $investor) {
      _id
      first_name
      last_name
      country
      entity_name
      investor_type
      signer_full_name
      accredited_investor_status
      email
      passport {
        link
        path
      }
    }
  }
`;

export default function KYC({ investor, setStatus }) {
  const [investorUpdates, update] = useSimpleReducer({});
  const [updateInvestor] = useMutation(UPDATE_USER, {
    onCompleted: () => setStatus('pledged'),
    onError: () =>
      toast.error(
        'Sorry, something went wrong. Try again or contact support at support@allocations.com',
      ),
  });

  const valid = Boolean({ ...investor, ...investorUpdates }.passport);

  const submit = () => {
    if (valid) {
      updateInvestor({ variables: { investor: { _id: investor._id, ...investorUpdates } } });
    }
  };

  return (
    <Paper className="KYC">
      <div>You need to perform a quick KYC to continue</div>

      <PassportUploader investor={investor} updates={investorUpdates} update={update} />
      <AccredidationUploader investor={investor} updates={investorUpdates} update={update} />
      <div>
        <Button variant="contained" onClick={submit} disabled={!valid} color="primary" size="small">
          SUBMIT
        </Button>
      </div>
    </Paper>
  );
}

function PassportUploader({ investor, updates, update }) {
  if (investor.passport) {
    return (
      <div className="file-uploader">
        <span className="file-label">Passport</span>
        <a href={`https://${investor.passport.link}`} target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon="paperclip" />
        </a>
      </div>
    );
  }

  if (updates.passport) {
    return (
      <div className="file-uploader">
        <span className="file-label">Passport</span>
        <FontAwesomeIcon size="lg" icon="check-circle" color={colors.success[500]} />
      </div>
    );
  }

  return (
    <div className="file-uploader">
      <span className="file-label">Passport or ID*</span>
      <Button variant="contained" component="label" size="small">
        Upload
        <input
          type="file"
          style={{ display: 'none' }}
          onChange={({ target }) => {
            if (target.validity.valid) update({ passport: target.files[0] });
          }}
        />
      </Button>
    </div>
  );
}

function AccredidationUploader({ investor, updates, update }) {
  if (investor.accredidation_doc) {
    return (
      <div className="file-uploader">
        <span className="file-label">Accredited Investor Certificate</span>
        <a href={`https://${investor.accredidation_doc.link}`} target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon="paperclip" />
        </a>
      </div>
    );
  }

  if (updates.accredidation_doc) {
    return (
      <div className="file-uploader">
        <span className="file-label">Accredited Investor Certificate</span>
        <FontAwesomeIcon size="lg" icon="check-circle" color={colors.success[500]} />
      </div>
    );
  }

  return (
    <div className="file-uploader">
      <Tooltip title="e.g. www.verifyinvestor.com certificate">
        <span className="file-label">Accredited Investor Certificate</span>
      </Tooltip>
      <Button variant="contained" component="label" size="small">
        Upload
        <input
          type="file"
          style={{ display: 'none' }}
          onChange={({ target }) => {
            if (target.validity.valid) update({ accredidation_doc: target.files[0] });
          }}
        />
      </Button>
    </div>
  );
}
