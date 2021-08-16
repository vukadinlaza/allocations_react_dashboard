import { phone, tablet } from '../../utils/helpers';

const styles = (theme) => ({
  backButton: {
    cursor: 'pointer',
    fontWeight: '600',
    width: '11em',
    '&:hover': {
      color: '#205df5',
    },
  },
  banner: {
    minWidth: '100%',
  },
  blue: {
    color: '#205DF5',
  },
  button: {
    color: 'white',
    fontSize: '16px',
  },
  buttonIcon: {
    fontFamily: 'Material Icons !important',
    color: 'white',
    fontSize: '16px',
  },
  buttonLink: {
    borderRadius: '100%',
    backgroundColor: '#0462FF',
    padding: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '-6px 0',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#3f85f9',
    },
  },
  chartContainer: {
    width: '70%',
    width: '60%',
    padding: '5% 0',
    [theme.breakpoints.down(tablet)]: {
      padding: 0,
      width: '100%',
      marginBottom: '20px',
      height: '250px',
    },
  },
  chartTableContainer: {
    maxHeight: '100%',
    width: '35%',
    minWidth: '175px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    '& table *': {},
    '& tr': {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      '& > *': {
        display: 'flex',
      },
      '& > *:first-child': {
        marginRight: '1em',
      },
    },
    [theme.breakpoints.down(tablet)]: {
      width: '100%',
    },
  },
  contentContainer: {
    width: '100%',
  },
  footerData: {
    fontSize: '14px',
  },
  grey: {
    color: '#5C6E84',
  },
  input: {
    border: '1px solid #707070',
    borderRadius: '10px',
    padding: '.25rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
  },
  investmentRow: {
    backgroundColor: '#FBFCFF',
    '&:hover': {
      backgroundColor: 'rgb(241, 244, 251)',
    },
  },
  investmentsContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingBottom: '50px',
  },
  links: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // width: '130px',
    '&>*': {
      margin: '0 10px',
    },
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: '700',
    padding: '0px',
    margin: '10px 0 35px 0',
    color: '#2A2B54',
  },
  modal: {
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    marginTop: '12vh',
    borderRadius: '1rem',
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    [theme.breakpoints.down(phone)]: {
      padding: '4vw',
    },
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    margin: '25px 0',
    background: 'white',
    padding: '15px 20px',
    border: 'solid 1px #dadada',
    boxShadow: '0px 3px 5px -5px',
    borderRadius: '3px',
  },
  section: {
    // width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '40px 0',
    [theme.breakpoints.down(phone)]: {
      padding: '4vw',
    },
  },
  simpleBoxDataRow: {
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  statusContainer: {
    fontWeight: 'bold',
    padding: '0.3em 2em',
    borderRadius: '2em',
    width: '120px',
    textAlign: 'center',
  },
  subSection: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  tableContainer: {
    maxWidth: 'calc(100vw - 300px)',
    minWidth: '175px',
    [theme.breakpoints.down(phone)]: {
      maxWidth: 'none',
      width: '100%',
    },
  },
  tableHeader: {
    textTransform: 'uppercase !important',
    color: '#3A506B !important',
    fontSize: '.75rem',
  },
});

export default styles;
