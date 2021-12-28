import { phone, tablet } from '../../../utils/helpers';
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
