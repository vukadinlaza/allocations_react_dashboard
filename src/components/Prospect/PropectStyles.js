import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #8493A640 !important',
    borderRadius: '10px',
    overflowX: 'none',
    width: '100%',
    height: '100%',
  },
  paperOutlined: {
    boxShadow: 'none !important',
    border: '1px solid #8493A640 !important',
    borderRadius: '10px !important',
  },
  paperTitle: {
    padding: '.5rem',
    paddingLeft: '1rem',
  },
  paperMain: {
    padding: '.5rem',
    paddingBottom: '1.5rem',
    paddingRight: '1rem',
    paddingLeft: '1rem',
  },
  primaryColor: {
    color: theme.palette.primary.main,
  },
  errorColor: {
    color: theme.palette.error.main,
  },
  errorHover: {
    '&:hover': {
      background: 'rgba(255, 23, 68, 0.05)',
    },
  },
  attachDeck: {
    border: '1px solid lightgrey !important',
    '&:hover': {
      border: '1px solid black !important',
    },
  },
  dealTypeButtonSelected: {
    width: '100%',
    height: '100%',
  },
  dealTypeButton: {
    width: '100%',
    height: '100%',
    background: 'white',
    color: 'black',
    border: 'solid 1px lightgrey',
    '&:hover': {
      color: 'white',
    },
  },
  cancelButton: {
    background: 'white',
    color: 'black',
    border: 'solid 1px lightgrey',
    '&:hover': {
      color: 'white',
      background: 'red',
    },
  },
  sectionList: {
    '&:not(:last-child)': {
      marginBottom: 20,
    },
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '.5rem',
  },
  selectedSectorsPaper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    width: '100%',
    minHeight: '50px',
    boxShadow: 'none !important',
  },
  chip: {
    margin: theme.spacing(0.5),
    color: 'white',
    fontWeight: 'bold',
  },
}));

export default useStyles;
