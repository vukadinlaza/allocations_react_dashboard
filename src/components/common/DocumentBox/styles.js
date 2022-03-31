import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  docAnchor: {
    width: '49%',
    minWidth: '400px',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  docPath: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  documentBox: {
    width: '100%',
    padding: '10px 20px',
    marginBottom: '10px',
    textAlign: 'left',
    textTransform: 'none',
    minWidth: (props) => props,
    transition: '0.5s',
    '&:hover': {
      backgroundColor: 'rgb(0 64 254 / 5%)',
    },
    '&:hover *': {
      color: '#0040FE',
    },
    '& *': {
      color: 'rgb(42,43,84,77%)',
    },
  },
  tooltip: {
    fontSize: 14,
  },
}));

export default useStyles;
