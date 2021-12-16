// import { phone } from '../../utils/helpers';

import { yellow } from '@material-ui/core/colors';

const styles = (theme) => ({
  cancelIcon: {
    position: 'absolute',
    right: '-10px',
    top: '-10px',
    zIndex: 1,
    color: '#4a4a4a',
    cursor: 'pointer',
    transition: '0.5s',
    '&:hover': {
      color: '#e71a1a',
    },
  },
  card: {
    borderRadius: '10px',
    border: '1px solid rgba(61, 61, 61, 0.12) !important',
    boxShadow: 'none !important',
  },
  cardContent: {
    padding: '0 !important',
  },
  itemIcon: {
    marginLeft: '.25rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  listItem: {
    padding: '16px',
    '&:hover': {
      backgroundColor: '#e7f0ff',
    },
    '&:hover *': {
      color: `${theme.palette.primary.main}`,
    },
  },
  listItemComplete: {
    padding: '16px',
    '&:hover': {
      backgroundColor: 'rgb(240 255 237)',
    },
    '&:hover * :not(path)': {
      color: `#2faf1a`,
    },
  },
  listItemActive: {
    padding: '16px',
    backgroundColor: '#e7f0ff',
    '&:hover': {
      backgroundColor: '#e7f0ff',
    },
    '& *': {
      color: `${theme.palette.primary.main}`,
    },
  },
  listItemActiveComplete: {
    padding: '16px',
    backgroundColor: 'rgb(240 255 237)',
    '&:hover': {
      backgroundColor: 'rgb(240 255 237)',
    },
    '& * :not(path)': {
      color: `#2faf1a`,
    },
  },
  loaderContainer: {
    backgroundColor: 'rgb(255 255 255 / 65%)',
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100vh',
    width: '100%',
    zIndex: 1,
  },
  mainBoxes: {
    margin: '6rem 0 2rem 0',
  },
  mainTitle: {
    padding: '1.25rem 60px',
    fontWeight: 900,
    position: 'absolute',
    width: '100%',
    left: '0',
    top: '0',
    background: 'white',
    borderBottom: '1px solid rgba(61, 61, 61, 0.12)',
    '&>*': {
      fontWeight: 'bold',
      fontSize: '28px',
    },
  },
  subTaskTitle: {
    fontSize: '1.2rem',
  },
  taskContainer: {
    border: '1px dashed rgba(61, 61, 61, 0.12)',
    borderRadius: '10px',
    padding: '10px 16px',
    margin: '16px 0',
  },
  taskLastUpdated: {
    color: '#b4b4b5',
    fontSize: '12px',
  },
  textField: {
    width: '100%',
    margin: '10px 0',
  },

  // Styles for Body of Deal Setup and common styling between CurrentStep and NextStep
  bodyContainer: {
    display: 'flex',
    justifyContent: 'center',
    // backgroundColor: 'yellow',
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
