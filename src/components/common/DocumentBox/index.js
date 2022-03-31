import React from 'react';
import { Typography, Paper, Tooltip } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import useStyles from './styles';

const DocumentBox = ({ doc, docPath, index, minWidth = '400px' }) => {
  const classes = useStyles(minWidth);

  return (
    <a
      href={doc?.link?.includes('http') ? doc.link : `//${doc.link}`}
      target="_blank"
      rel="noopener noreferrer"
      key={`doc-${index}`}
      className={classes.docAnchor}
    >
      <Paper className={classes.documentBox} variant="outlined" square>
        <Tooltip
          title={docPath}
          classes={{
            tooltip: classes.tooltip,
          }}
        >
          <Typography className={classes.docPath}>
            <InsertDriveFileIcon /> {docPath}
          </Typography>
        </Tooltip>
      </Paper>
    </a>
  );
};

export default DocumentBox;
