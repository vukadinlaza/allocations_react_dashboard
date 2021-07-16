import React from 'react';
import { Paper, Typography, Grid } from '@material-ui/core';

const Document = ({ doc }) => {
  const file = doc?.path.slice(0, 12) === 'investments/' ? doc.path.split('/')[2] : doc.path.split('/')[1];
  const timeStamp = file.split('-')[0];
  const docNameToUse = new Date(Number(timeStamp)).getTime() > 0 ? file.substring(14) : file;
  return (
    <Grid item lg={3} md={3} sm={12} xs={12}>
      <a href={`https://${doc?.link}`} target="_blank" rel="noopener noreferrer">
        <Paper
          style={{
            flexDirection: 'column',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '.5rem',
            minHeight: '8rem',
            borderRadius: '1rem',
          }}
        >
          <img src="https://allocations-public.s3.us-east-2.amazonaws.com/file-icon.svg" alt="document icon" />
          <Typography
            variant="subtitle2"
            style={{ wordBreak: 'break-all', fontSize: '.7rem', paddingLeft: '.75rem', paddingRight: '.75rem' }}
          >
            <span style={{ color: 'blue' }}>{docNameToUse || doc?.path}</span>
          </Typography>
        </Paper>
      </a>
    </Grid>
  );
};
export default Document;
