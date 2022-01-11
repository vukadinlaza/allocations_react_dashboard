import { phone } from '../../../utils/helpers';
import { Theme } from '@material-ui/core';

const styles: any = (theme: Theme) => ({
  avatarBackground: {
    width: '48px',
    height: '48px',
    background: '#ECF3FF',
    borderRadius: '24px',
    padding: '12px',
  },
  backButton: {
    paddingLeft: '12.5%',
    paddingBottom: '24px',
    color: '#64748B',
    fontWeight: 500,
    cursor: 'pointer',
  },
  backdrop: {
    background: 'rgba(112, 112, 112, 0.5)',
  },
  boardBox: {
    height: '160px',
    width: '100%',
    background: '#FFFFFF',
    borderRadius: '8px',
    marginBottom: '8px',
    padding: '16px 24px',
  },
  boardBoxMainText: {
    fontSize: '12px',
    fontWeight: 400,
    color: '#2A2B54',
    margin: 0,
    marginBottom: '4px',
    lineHeight: '16px',
  },
  boardBoxText: {
    fontSize: '12px',
    fontWeight: 400,
    color: '#64748B',
    margin: 0,
    marginBottom: '4px',
    lineHeight: '16px',
  },
  boardBoxTitle: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#64748B',
    margin: 0,
    marginBottom: '4px',
    lineHeight: '16px',
  },
  boardContainer: {
    overflowX: 'scroll',
    paddingTop: '8px',
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
  completedTaskListItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '3.5vh 5.5vw',
    width: '100%',
    margin: '10px 0px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
  },
  completedTaskCheckImageContainer: {
    marginRight: '15px',
  },
  completedTaskText: {
    marginRight: '15px',
    fontFamily: 'roboto',
    fontSize: '18px',
    color: '#94A3B8',
  },
  completedTaskToggle: {
    color: '#0F172A',
    fontWeight: '500',
    cursor: 'pointer',
  },
  closeModal: {
    color: 'white',
    cursor: 'pointer',
  },
  copyLink: {
    width: '100%',
    height: '48px',
    fontWeight: 500,
    fontSize: '16px',
    color: '#64748B',
    textTransform: 'none',
    padding: '12px',
    marginTop: '8px',
    '&:hover, &:focus': {
      color: '#334155',
      background: 'rgba(0,0,0,0)',
      outline: 'none',
    },
    '&:active': {
      color: '#0F172A',
      background: 'rgba(0,0,0,0)',
    },
  },
  emailsContainer: {
    marginTop: '16px',
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    maxHeight: '200px',
    overflowY: 'scroll',
  },
  emailsInput: {
    width: '100%',
    position: 'relative',
  },
  emailTag: {
    height: '32px',
    background: '#ECF3FF',
    borderRadius: '16px',
    color: '#0558E7',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    marginRight: '8px',
    marginBottom: '16px',
  },
  emailTagText: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#0558E7',
  },
  emailTagCancel: {
    color: '#0558E7',
    fontSize: '14px',
    marginLeft: '8px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    width: '100%',
    fontSize: '12px',
    margin: '0',
    marginTop: '0.5em',
    paddingLeft: '6px',
    // position: 'absolute',
    // bottom: '-26px'
  },
  headerLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#2A2B54',
    marginBottom: '16px',
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
  inviteButton: {
    width: '88px',
    height: '48px',
    background: '#186EFF',
    borderRadius: '8px',
    color: 'white',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 500,
    '&:hover': {
      background: '#0558E7',
    },
    '&:active': {
      background: '#0444B4',
    },
  },
  inviteButtonDisabled: {
    width: '88px',
    height: '48px',
    background: '#CBD5E1',
    borderRadius: '8px',
    color: '#64748B',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 500,
  },
  inviteButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  largeBox: {
    height: '500px',
    width: '100%',
    borderRadius: '8px',
    boxShadow: 'none !important',
  },
  modal: {
    width: '520px',
    maxHeight: '672px',
    height: 'auto',
    minHeight: '432px',
    filter: 'drop-shadow(0px 20px 56px rgba(0, 0, 0, 0.29))',
    borderRadius: '8px',
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentContainer: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalSubtitle: {
    fontSize: '20px',
    fontWeight: 500,
    color: '#2A2B54',
    lineHeight: '24px',
    margin: '16px 0 40px 0',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 500,
    color: 'white',
  },
  modalTitleContainer: {
    height: '64px',
    background: '#186EFF',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: '40px',
    fontWeight: 'bold',
    marginBottom: '32px',
  },
  personAdd: {
    fontSize: '22px',
    color: '#186EFF',
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
    margin: '32px 0 24px 0',
  },
  smallBox: {
    height: '88px',
    width: '100%',
    borderRadius: '8px',
    boxShadow: 'none !important',
    padding: '16px 24px',
  },
  toast: {
    width: '344px',
    height: '56px',
    background: '#FBFCFF',
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.11)',
    borderRadius: '8px',
    '& .Toastify__close-button > svg': {
      fill: 'currentColor',
      height: '50px',
      width: '20px',
    },
    '& .Toastify__close-button--default': {
      opacity: '1.0',
    },
  },
  toastBody: {
    fontWeight: 400,
    fontSize: '16px',
    color: '#334155',
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
