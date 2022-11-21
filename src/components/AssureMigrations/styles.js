import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
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
  documentIframe: {
    width: '100%',
    height: '500px',
  },
  formContainer: {
    width: '514px',
    height: '700px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'cemter',
    flexDirection: 'column',
    padding: '20px',
  },
  input: {
    width: '100%',
    marginTop: '20px',
  },
  leftSide: {
    background: '#2A2B54',
    padding: '110px 80px',
  },
  mainContainer: {
    height: '100vh',
    width: '100vw',
    margin: '-2rem -3rem',
  },
  rightSide: {
    padding: '110px 80px',
    display: 'flex',
    justifyContent: 'center',
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
}));

export default useStyles;
