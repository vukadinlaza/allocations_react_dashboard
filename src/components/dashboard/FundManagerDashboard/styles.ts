import { Theme } from '@material-ui/core';
import { phone } from '../../../utils/helpers';

const styles = (theme: Theme) => ({
  box: {
    marginBottom: '20px',
  },
  buttonsContainer: {
    display: 'flex',
  },
  computerBoxes: {
    [theme.breakpoints.down(phone)]: {
      display: 'none',
    },
  },
  input: {
    color: '#2A2B54',
    '&::placeholder': {
      color: '#94A3B8',
      fontSize: '14px',
      opacity: 1,
      fontWeight: 'normal',
    },
  },
  inputRoot: {
    borderRadius: '8px',
    background: 'white',
    color: '#64748B',
    marginTop: '20px',
  },
  list: {
    [theme.breakpoints.up(1367)]: {
      maxWidth: '49%',
    },
    [theme.breakpoints.down(phone)]: {
      width: '100%',
      overflowX: 'scroll',
      maxWidth: '100%',
      marginBottom: '44px',
    },
  },
  listsContainer: {
    marginTop: '50px',
  },
  mainContainer: {
    [theme.breakpoints.down(phone)]: {
      maxWidth: '100vw',
    },
  },
  mobileBoxes: {
    [theme.breakpoints.up(phone)]: {
      display: 'none',
    },
  },
  searchContainer: {
    marginTop: '32px',
  },
  textFieldRoot: {
    width: '100%',
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#186EFF',
    },
  },
  titleContainer: {
    margin: '48px 0 24px 0',
  },
});

export default styles;
