import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  assure: {
    marginTop: '60px',
    maxWidth: '387px',
    minWidth: '327px',
    height: '77px',
    background: 'rgba(0, 148, 144, 0.25)',
    border: '1px dashed #009490',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 32px',
  },
  bottomInformation: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
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
    alignItems: 'flex-start',
  },
  checkTextDescription: {
    marginTop: '12px',
  },
  declineBody: {
    padding: '10px 20px 20px 20px',
  },
  declineDialog: {
    '& [class*=MuiDialog-paper]': {
      borderRadius: '8px',
      maxWidth: 'none',
      width: '523px',
    },
  },
  declineTitle: {
    background: '#186EFF',
    color: 'white',
  },
  dialogActions: {
    display: 'flex',
    flexDirection: 'column',
    '&>*': {
      marginBottom: '12px',
    },
  },
  documentIframe: {
    width: '100%',
    height: '500px',
  },
  formContainer: {
    width: '514px',
    height: '730px',
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
    // marginTop: '4px',
  },
  dataFormInput: {
    width: '100%',
    marginTop: '4px',
  },
  leftSide: {
    background: '#2A2B54',
    padding: '96px 10%',
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
  qualifyingContainer: {
    height: '800px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'cemter',
    flexDirection: 'column',
    padding: '20px 55px',
    overflowY: 'scroll',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  paymentForm: {
    width: '514px',
    height: '830px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'cemter',
    flexDirection: 'column',
    padding: '60px',
    overflowY: 'scroll',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  paymentMethod: {
    width: '134px',
    height: '100px',
    background: '#FFFFFF',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    marginLeft: '8px',
    padding: '15px 20px',
    cursor: 'pointer',
  },
  paymentMethods: {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  quantity: {
    display: 'flex',
    alignItems: 'center',
    '& *': {
      marginRight: '8px',
    },
  },
  quantityContainer: {
    marginTop: '8px',
    padding: '8px',
  },
  quantityModifier: {
    cursor: 'pointer',
    height: '16px',
    width: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  rightSide: {
    padding: '20px 80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      padding: '20px',
    },
  },
  step: {
    display: 'flex',
    width: '100%',
    margin: '12px 0',
    '&>*': {
      marginRight: '8px',
      minWidth: '72px',
    },
  },
  subChecks: {
    paddingLeft: '60px !important',
  },
  subscriptionRightSide: {
    padding: '20px 80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      padding: '20px',
    },
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
    // [theme.breakpoints.down('md')]: {
    //   height: '800px',
    // },
  },
  thankyouText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '25px',
    '& span': {
      marginRight: '4px',
    },
  },
  titleUnderline: {
    background: 'rgb(0, 64, 254)',
    height: '2px',
    width: '250px',
    margin: '15px 0 25px 0',
  },
  warning: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  group: {
    padding: '0.5rem 0',
  },
  label: {
    fontWeight: 'bolder',
    margin: '0',
    padding: '0',
  },
  help: {
    color: '#186EFF',
    verticalAlign: 'sub',
  },
  button: {
    borderRadius: '8px',
    border: 'solid 1px #CBD5E1',
    textTransform: 'none',
    width: '200px',
    height: '50px',
    '&:first-child': {
      margin: '0.5rem 0.5rem 0.5rem 0rem',
    },
    '&:last-child': {
      margin: '0.5rem 0rem 0.5rem 0.5rem',
    },
  },
  containedOverride: {
    backgroundColor: 'rgba(236, 243, 255, 1)',
    color: 'rgba(24, 110, 255, 1)',
    border: 'solid 2px #205DF5 !important',
    '&:hover': {
      backgroundColor: 'rgba(236, 243, 255, 1)',
    },
  },
  rootOverride: {
    padding: '5px',
  },
  groupedOutlinedHorizontalOverride: {
    '&:not(:last-child)': { borderRightColor: '#CBD5E1' },
  },
  groupedHorizontalOverride: {
    '&:not(:last-child)': {
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
      '&:hover': {
        border: 'solid 1px #205DF5',
      },
    },
    '&:not(:first-child)': {
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
    },
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default useStyles;
