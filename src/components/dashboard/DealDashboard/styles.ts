import { phone } from '../../../utils/helpers';
import { Theme } from '@material-ui/core';

const styles: any = (theme: Theme) => ({
  backButton: {
    paddingLeft: '12.5%',
    paddingBottom: '24px',
    color: '#64748B',
    fontWeight: 500,
    cursor: 'pointer',
  },
  boxTitle: {
    fontWeight: 500,
    fontSize: '16px',
    color: '#64748B',
  },
  boxValue: {
    fontWeight: 700,
    fontSize: '20px',
    color: '#2A2B54',
  },
  cellValue: {
    margin: '0',
    fontSize: '12px',
    fontWeight: 400,
  },
  input: {
    color: '#2A2B54',
    '&::placeholder': {
      // textOverflow: 'ellipsis !important',
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
  },
  largeBox: {
    height: '500px',
    width: '100%',
    borderRadius: '8px',
    boxShadow: 'none !important',
  },
  pageTitle: {
    fontSize: '30px',
    fontWeight: '800',
    marginBottom: '24px',
  },
  placeholderItem: {
    boxShadow: 'none !important',
    position: 'relative',
    background: 'rgb(229 229 229 / 50%)',
    overflow: 'hidden',
    '&::before': {
      content: "''",
      display: 'block',
      position: 'absolute',
      left: '-150px',
      top: '0',
      height: '100%',
      width: '150px',
      background: 'linear-gradient(to right, transparent 0%, #f3f3f3 50%, transparent 100%)',
      animation: '$load 1s cubic-bezier(0.4, 0.0, 0.2, 1) infinite',
    },
  },
  searchContainer: {
    margin: '40px 0 25px 0',
  },
  smallBox: {
    height: '88px',
    width: '100%',
    borderRadius: '8px',
    boxShadow: 'none !important',
    padding: '16px 24px',
  },
  tabsContainer: {
    [theme.breakpoints.down(phone)]: {
      overflowX: 'scroll',
      display: 'block',
    },
  },
  textBottom: {
    color: '#64748B',
  },
  textFieldRoot: {
    width: '100%',
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#186EFF',
    },
  },
  textTop: {
    color: '#2A2B54',
  },
  viewButton: {
    fontSize: '16px',
    textTransform: 'none',
    padding: '1px 15px',
    fontWeight: 500,
    border: '1px solid #64748B',
    marginLeft: '8px',
    height: '32px',
    color: '#64748B',
    boxSizing: 'border-box',
    transition: '0s',
    '& svg': {
      marginRight: '8px',
    },
    '&:hover': {
      backgroundColor: '#ECF3FF',
      border: '1px solid #CBD5E1',
      outline: 'none',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  viewButtonContainer: {
    //Need this to avoid movement when selecting buttons
    display: 'flex',
    justifyContent: 'center',
  },
  viewButtonSelected: {
    border: '2px solid #186EFF',
    color: theme.palette.primary.main,
    backgroundColor: '#ECF3FF',
    transition: '0s',
    '&:hover, &:focus': {
      border: '2px solid #186EFF',
    },
  },
  '@keyframes load': {
    from: { left: '-150px' },
    to: { left: '100%' },
  },

  // Stepper
  stepperContainer: {
    backgroundColor: 'inherit',
    border: 'none',
    boxShadow: 'none !important',
    padding: '0px 0px 35px 0px', // here
    width: '100%',

    '& .MuiStepIcon-root': {
      color: '#E2E8F0',
    },
    '& .MuiStepLabel-alternativeLabel': {
      fontSize: '12px',
    },
    '& .MuiStepIcon-root.MuiStepIcon-active': {
      color: '#186EFF',
    },
    '& .MuiStepIcon-root.MuiStepIcon-completed': {
      color: '#186EFF',
    },
    '& .MuiStepConnector-completed .MuiStepConnector-line, .MuiStepConnector-active .MuiStepConnector-line,':
      {
        borderColor: '#186EFF',
      },
    '& .MuiStepIcon-text': {
      fontSize: '1rem',
      // not aligned when increasing fontsize
      verticalAlign: 'middle',
    },
  },

  // Styles for Body of PostBuild and common styling between CurrentStep and NextStep
  badgeBlue: {
    borderRadius: '100px',
    fontSize: '11px',
    padding: '5px 10px',
    color: '#186EFF',
    backgroundColor: '#ECF3FF',
  },
  badgeGray: {
    borderRadius: '100px',
    fontSize: '11px',
    padding: '5px 10px',
    color: '#334155',
    backgroundColor: '#F1F5F9',
  },
  bodyContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  stepText: {
    textTransform: 'uppercase',
    color: '#2A2B54',
    fontWeight: '500',
    fontSize: '12px', // ask for font size
    marginBottom: '5px',
  },
  stepTitleRow: {
    display: 'flex',
    fontWeight: '500',
    paddingBottom: '10px',
    width: '100%',
    '& *': {
      marginRight: '20px',
    },
    '& :last-child': {
      margin: '0px',
      '& img': {
        marginRight: '10px',
      },
    },
  },

  // Styles for Current Step
  currentStepContainer: {
    paddingBottom: '30px',
    height: 'fit-content',
  },
  currentStepBody: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    border: '2px solid #186EFF',
    borderRadius: '8px',
    backgroundColor: '#ECF3FF',
    padding: '3.5vh 5.5vw',
  },

  // Styles for Next Step
  nextStepContainer: {
    height: 'fit-content',
    width: '100%',
  },
  nextStepBody: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: '8px',
    backgroundColor: '#FFF',
    padding: '3.5vh 5.5vw',
  },
});

export default styles;
