import { phone } from '../../utils/helpers';

const styles = (theme) => ({
  back: {
    cursor: 'pointer',
    marginBottom: '20px',
    fontWeight: 'bold',
    '&:hover': {
      color: '#0040FE',
    },
  },
  button: {
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
  cancelButton: {
    width: '100%',
    color: '#2A2C54',
    fontWeight: '500',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
      color: '#242973',
    },
  },
  cellText: {
    color: '#2A2B54 !important',
  },
  contentContainer: {
    margin: '40px',
    backgroundColor: '#f7f7f7',
  },
  createButton: {
    backgroundColor: '#39C522',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    textTransform: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#56db40',
    },
    '&:focus': {
      outline: 'none',
    },
    [theme.breakpoints.down(phone)]: {
      fontSize: '.5rem',
    },
  },
  createButtonLink: {
    zIndex: 1,
    '&:hover': {
      textDecoration: 'none',
    },
    [theme.breakpoints.down(phone)]: {
      marginBottom: '1em',
      '& *': {
        // marginLeft: "0 !important",
      },
    },
  },
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    position: 'absolute',
    width: '100%',
    left: '0',
    top: '0',
    background: 'white',
  },
  editMultiple: {
    cursor: 'pointer',
    color: '#a9a9a9',
    fontSize: '1.2rem',
    marginLeft: '0.5rem',
    '&:hover': {
      color: '#0462FF',
    },
  },
  formContainer: {
    paddingTop: '20px',
    backgroundColor: '#FBFCFF',
    marginTop: '10px',
  },
  headerText: {
    color: '#2A2B54 !important',
    fontWeight: '400',
  },
  investmentsMainTitle: {
    fontSize: '28px',
    fontWeight: '700',
    padding: '0px',
    paddingBottom: '20px',
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
    padding: '20px 0px',
  },
  mainTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 40px',
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
      fontSize: '.5rem',
    },
  },
  row: {
    '&:hover': {
      background: '#f1f4fb',
    },
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '25px',
    background: 'white',
    padding: '15px 20px',
    border: 'solid 1px #dadada',
    boxShadow: '0px 3px 5px -5px',
    borderRadius: '3px',
  },
  section: {
    width: '100%',
    padding: '40px',
    margin: '0px',
    [theme.breakpoints.down(phone)]: {
      padding: '10px',
    },
  },
  selectedCheckbox: {
    color: theme.palette.primary.main,
  },
  selectedTab: {
    fontWeight: 'bold !important',
    '& $tabWrapper': {
      backgroundColor: 'rgb(32 93 245 / 16%)',
      borderRadius: '10px',
    },
  },
  tab: {
    textTransform: 'none',
    minWidth: 0,
    fontWeight: '400',
    '&:focus': {
      outline: 'none',
    },
  },
  tableContainer: {
    background: '#FBFCFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #8493A640',
    borderRadius: '10px',
    marginBottom: '50px',
  },
  tabs: {
    width: '100%',
    border: 'none',
    height: '50px',
    padding: '0 28px',
    '& *': {
      height: '100%',
    },
    [theme.breakpoints.down(phone)]: {
      padding: '0 12px',
    },
  },
  tabsContainer: {
    [theme.breakpoints.down(phone)]: {
      overflowX: 'scroll',
      display: 'block',
    },
  },
  tabsIndicator: {
    display: 'none',
  },
  tabWrapper: {
    padding: '0 20px',
  },
  title: {
    position: 'absolute',
    top: '85px',
    fontWeight: '500',
    color: '#2A2C54',
  },
  updateButton: {
    width: '100%',
    color: 'white',
    backgroundColor: '#2A2C54',
    fontWeight: '500',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#242973',
    },
  },
});

export default styles;
