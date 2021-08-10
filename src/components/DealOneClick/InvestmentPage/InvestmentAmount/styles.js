import { makeStyles, withStyles } from '@material-ui/core/styles';
import { InputAdornment } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '20px 0',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '95%',
    },
  },
  inputContainer: {
    [theme.breakpoints.down('sm')]: {
      margin: '0 20px',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '60%',
      marginLeft: '20px',
    },
  },
  buttonContainer: {
    [theme.breakpoints.down('sm')]: {
      margin: '10px 20px 0 20px',
    },
  },
  currencyButton: {
    padding: '1rem 2rem',
    backgroundColor: '#28c600',
    color: 'white',
    textTransform: 'none',
    fontWeight: '700',
    outline: 'none',
    '&:hover': {
      backgroundColor: '#28c600',
    },
    '&:focus': {
      outline: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: '10px 0',
    },
    [theme.breakpoints.up('md')]: {
      whiteSpace: 'nowrap',
      width: '100%',
    },
  },
}));

export const Adornment = withStyles(() => ({
  root: {
    '& > p': {
      color: '#3cb345',
      backgroundColor: '#d8ffde',
      fontWeight: '600',
      fontSize: '.8rem',
      margin: '0 5px',
      padding: '2.5px 10px ',
      borderRadius: '2.5px',
    },
  },
}))(InputAdornment);

export default useStyles;
