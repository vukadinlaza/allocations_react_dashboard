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
    color: theme.colors.black[50],
    '&::placeholder': {
      color: theme.colors.gray[400],
      fontSize: '14px',
      opacity: 1,
      fontWeight: 'normal',
    },
  },
  inputRoot: {
    borderRadius: '8px',
    background: theme.colors.white[100],
    color: theme.colors.gray[500],
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
      borderColor: theme.colors.primary[500],
    },
  },
  titleContainer: {
    margin: '48px 0 24px 0',
  },
});

export default styles;
