import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import documentIcon from '../../../../../assets/document-icon.svg';
import uploadIcon from '../../../../../assets/upload-icon.svg';
import CheckCircle from '../../../../../assets/check_circle_black_24dp.svg';
import useStyles from '../../../BuildStyles';

const ADD_DOC = gql`
  mutation addDealDocService($deal_id: String!, $task_id: String!, $doc: Upload!, $phase: String) {
    addDealDocService(deal_id: $deal_id, task_id: $task_id, doc: $doc, phase: $phase)
  }
`;

const uploadTaskMap = {
  'Upload Term Sheet': {
    text: 'Portfolio Company Term Sheet',
    position: 1,
  },
  'Upload Company Deck': {
    text: 'Pitch Deck',
    position: 2,
  },
  'Upload Company Logo': {
    text: 'Portfolio Company Logo',
    position: 3,
  },
};

const DocUploader = ({
  document,
  filesUploaded,
  setFilesUploaded,
  deal,
  // no change
  classes,
  addDoc,
}) => {
  // const { data, refetch: refetchDeal } = useQuery(DEAL, {
  //   variables: { deal_id: deal?._id },
  // });

  // useEffect(() => {
  //   if (filesUploaded[document.title].complete) {
  //     addDoc({
  //       variables: {
  //         doc: filesUploaded[document.title]?.document,
  //         task_id: document?._id,
  //         deal_id: deal?._id,
  //         phase: 'build',
  //       },
  //     });
  //     localStorage.setItem('buildFilesUploaded', JSON.stringify(filesUploaded));
  //   }
  // }, [filesUploaded]);

  return (
    <div
      className={`${classes.item} ${
        !filesUploaded[document.title].complete ? '' : classes.selected
      }`}
    >
      <div className={classes.docIconBox}>
        <img src={documentIcon} alt="document icon" />
      </div>
      <Typography className={classes.itemText}>{uploadTaskMap[document.title].text}</Typography>
      {!filesUploaded[document.title].complete ? (
        <div className={classes.uploadIcon} style={{ opacity: '1', textAlign: 'center' }}>
          <label htmlFor="doc-upload" className={classes.uploadIconLabel}>
            <img
              src={uploadIcon}
              className={classes.uploadIcon}
              style={{ opacity: '1', cursor: 'pointer' }}
              alt="checkbox"
            />
            &nbsp;Upload document
          </label>
          <form>
            <input
              id="doc-upload"
              className={classes.uploadIcon}
              type="file"
              style={{ display: 'none' }}
              accept="application/pdf"
              multiple
              onChange={({ target }) => {
                if (target.validity.valid) {
                  setFilesUploaded((prev) => {
                    return {
                      ...prev,
                      [document.title]: { complete: true, document: target.files[0] },
                    };
                  });
                  addDoc({
                    variables: {
                      doc: target.files[0],
                      task_id: document?._id,
                      deal_id: deal?._id,
                      phase: 'build',
                    },
                  });
                  localStorage.setItem('buildFilesUploaded', JSON.stringify(filesUploaded));
                }
              }}
            />
          </form>
        </div>
      ) : (
        <img
          src={CheckCircle}
          className={classes.checkCircle}
          alt="checkbox"
          style={{ opacity: '1' }}
        />
      )}
    </div>
  );
};

export default function UploadDocs({ page, setPage, deal }) {
  const classes = useStyles();

  const [filesUploaded, setFilesUploaded] = useState({
    'Upload Company Logo': {
      complete: false,
      document: null,
    },
    // 'Upload ID': {
    //   complete: false,
    //   document: null,
    // },
    'Upload Company Deck': {
      complete: false,
      document: null,
    },
    'Upload Term Sheet': {
      complete: false,
      document: null,
    },
  });

  const currentPhase = deal.phases.find((phase) => phase.name === 'build');
  const uploadTasks = currentPhase.tasks
    .filter((task) => task.type === 'fm-document-upload' && task.title !== 'Upload ID')
    .sort((a, b) => {
      // console.log('rank', uploadTaskMap[a.title].position, uploadTaskMap[b.title].position)
      console.log('a', uploadTaskMap[a.title]);
      console.log('b', uploadTaskMap[b.title]);
      return uploadTaskMap[a.title].position - uploadTaskMap[b.title].position;
    });

  console.log(uploadTasks);

  const history = useHistory();
  const [addDoc] = useMutation(ADD_DOC, {
    onCompleted: () => {
      toast.success('Success! Your document has been added');
    },
  });
  useEffect(() => {
    if (localStorage.getItem('buildFilesUploaded')) {
      setFilesUploaded(JSON.parse(localStorage.getItem('buildFilesUploaded')));
    }
  }, []);
  return (
    <>
      <main className={classes.docUploadBox}>
        {/* <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}> */}
        {/* Upload your documents{' '} */}
        {/* </Typography> */}
        {/* <Typography variant="h6" gutterBottom className={classes.subtitle}>
          Please upload the appropriate documents so we have them on file for you. When uploading
          multiple files, please compress them into one zip folder.
        </Typography> */}
        <section className={classes.uploadContainer}>
          {uploadTasks.map((task) => (
            <DocUploader
              key={task._id}
              document={task}
              classes={classes}
              filesUploaded={filesUploaded}
              setFilesUploaded={setFilesUploaded}
              addDoc={addDoc}
              deal={deal}
            />
          ))}
        </section>
        {/* <Button
          className={classes.finishButton}
          onClick={() => {
            toast.success('Success! Your submission was submitted.');
            localStorage.removeItem('buildData');
            localStorage.removeItem('buildDeal');
            localStorage.removeItem('buildFilesUploaded');
            if (deal?._id) history.push(`/deal-setup?id=${deal._id}`);
          }}
        >
          Finish
        </Button> */}
        {/* <Typography
          className={classes.previousButton}
          onClick={() => {
            setPage(page - 1);
          }}
        >
          Previous
        </Typography> */}
      </main>
    </>
  );
}
