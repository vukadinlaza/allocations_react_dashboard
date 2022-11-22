import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  airtableForm: {
    width: '100%',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      height: '800px',
    },
  },
  checkbox: {
    verticalAlign: 'bottom',
  },
  checkboxLabel: {
    margin: 0,
    pointerEvents: 'none',
    '&>[class*=MuiCheckbox-root]': {
      marginRight: '8px',
      pointerEvents: 'auto',
    },
  },
  checkText: {
    marginLeft: '16px',
  },
  checkTextContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  declineBody: {
    padding: '10px 20px 20px 20px',
  },
  declineDialog: {
    '& [class*=MuiDialog-paper]': {
      borderRadius: '8px',
      maxWidth: 'none',
      width: '400px',
    },
  },
  declineTitle: {
    background: '#186EFF',
    color: 'white',
  },
  documentIframe: {
    width: '100%',
    height: '500px',
  },
  formContainer: {
    width: '514px',
    height: '830px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'cemter',
    flexDirection: 'column',
    padding: '20px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  input: {
    width: '100%',
    marginTop: '20px',
  },
  leftSide: {
    background: '#2A2B54',
    padding: '110px 10%',
  },
  mainContainer: {
    height: '100vh',
    width: '100vw',
    margin: '-2rem -3rem',
  },
  modal: {
    '&>div': {
      '&>div': {
        width: '640px',
      },
    },
  },
  rightSide: {
    padding: '20px 80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      padding: '20px',
    },
  },
  subChecks: {
    paddingLeft: '60px !important',
  },
  terms: {
    cursor: 'pointer',
  },
  termsContainer: {
    display: 'inline-block',
    alignItems: 'center',
    margin: '20px 0',
  },
  text: {
    marginLeft: '5px',
  },
  textSpace: {
    width: '4px',
    height: '1px',
    display: 'inline-block',
  },
  thankyou: {
    width: '514px',
    height: '426px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
    padding: '55px 32px',
    alignSelf: 'center',
    boxSizing: 'border-box',
  },
  thankyouText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& span': {
      marginRight: '4px',
    },
  },
}));

export default useStyles;
