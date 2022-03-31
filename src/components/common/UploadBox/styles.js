import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  docPath: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '& span': {
      marginLeft: '0.5em',
    },
  },
  uploadBox: {
    width: '100%',
    minWidth: 0,
    padding: '10px 20px',
    textAlign: 'left',
    textTransform: 'none',
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
  uploadButton: {
    width: (props) => props,
    padding: '6px 0',
    '&:hover': {
      background: 'none',
    },
    '&:focus': {
      outline: 'none',
    },
  },
}));

export default useStyles;
