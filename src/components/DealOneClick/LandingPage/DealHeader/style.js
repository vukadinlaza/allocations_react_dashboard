import { makeStyles } from '@material-ui/core';

// eslint-disable-next-line import/prefer-default-export
export const useStyles = makeStyles({
  dealHeader: {
    width: '100%',
    padding: '58px',
  },

  imageWrapper: {
    justifySelf: 'flex-end',
    width: '50%',
    height: '50%',
    margin: '0',
    padding: '0',
    overflow: 'hidden',
    // objectFit: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
});
