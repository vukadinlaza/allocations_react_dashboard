import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  back: {
    color: theme.colors.black[50],
    cursor: 'pointer',
    padding: '6px 8px',
    '&:hover': {
      backgroundColor: theme.colors.gray[100],
      borderRadius: '5px',
    },
  },

  button: {
    color: theme.colors.white[100],
    fontSize: '16px',
    '&:focus': { outline: 'none', border: 'none' },
  },
  buttonUser: {
    color: theme.colors.brand[300],
    fontSize: '1rem',
    marginLeft: '1em',
    cursor: 'pointer',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.colors.gray[100],
    },
    '&:focus': {
      outline: 'none',
      border: 'none',
    },
  },

  buttonLink: {
    borderRadius: '100%',
    backgroundColor: theme.colors.primary[600],
    padding: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '-6px 0',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.primary[300],
    },
  },
  cancelButton: {
    width: '100%',
    color: theme.colors.black[50],
    fontWeight: '500',
    fontSize: '16px',
    marginTop: '5px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.colors.gray[100],
      color: theme.colors.primary[900],
    },
    '&:focus': {
      outline: 'none',
      border: 'none',
    },
  },
  cellText: {
    color: `${theme.colors.black[50]} !important`,
  },
  contentContainer: {
    padding: '2rem',
    [theme.breakpoints.down('sm')]: {
      padding: '.5rem',
    },
  },
  createButton: {
    backgroundColor: theme.colors.success[500],
    display: 'flex',
    alignItems: 'center',
    color: theme.colors.white[100],
    textTransform: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.success[400],
    },
    '&:focus': {
      outline: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '.5rem',
    },
  },
  createButtonLink: {
    zIndex: 1,
    '&:hover': {
      textDecoration: 'none',
    },
    [theme.breakpoints.down('sm')]: {
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
    left: '0',
    top: '0',
    background: theme.colors.white[100],
  },
  dataContainer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '300px',
    width: '50%',
    marginBottom: '30px',
  },
  documentsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  editMultiple: {
    cursor: 'pointer',
    color: theme.colors.gray[400],
    fontSize: '1.2rem',
    marginLeft: '0.5rem',
    '&:hover': {
      color: theme.colors.primary[600],
    },
  },
  fieldTitle: {
    fontWeight: 'bold',
    color: `${theme.colors.black[50]}C4`,
    marginBottom: '8px',
  },
  fieldValue: {
    color: `${theme.colors.black[50]}C4`,
  },

  formContainer: {
    backgroundColor: theme.colors.primary[25],
  },
  headerText: {
    color: `${theme.colors.black[50]} !important`,
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
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      fontSize: '.5rem',
    },
  },
  row: {
    '&:hover': {
      background: theme.colors.gray[100],
    },
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '25px',
    background: theme.colors.white[100],
    padding: '15px 20px',
    border: `solid 1px ${theme.colors.gray[200]}`,
    boxShadow: '0px 3px 5px -5px',
    borderRadius: '3px',
  },
  section: {
    width: '100%',
    padding: '40px',
    margin: '0px',
    [theme.breakpoints.down('sm')]: {
      padding: '10px',
    },
  },
  sectionContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    paddingBottom: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '28px',
    color: `${theme.colors.black[50]}C4`,
  },

  selectedCheckbox: {
    color: theme.palette.primary.main,
  },
  selectedTab: {
    fontWeight: 'bold !important',
    '& $tabWrapper': {
      backgroundColor: `${theme.colors.primary[600]}25`,
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
    background: `${theme.colors.primary[25]} 0% 0% no-repeat padding-box`,
    boxShadow: `0px 3px 6px ${theme.colors.black[100]}29`,
    border: `1px solid ${theme.colors.gray[400]}40`,
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
    [theme.breakpoints.down('sm')]: {
      padding: '0 12px',
    },
  },
  tabsContainer: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      overflow: 'auto',
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
    margin: '0 0 26px 0',
    fontWeight: '500',
    color: theme.colors.black[50],
    fontSize: '18px',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    marginBottom: '25px',
  },

  updateButton: {
    width: '100%',
    color: theme.colors.white[100],
    backgroundColor: theme.colors.black[50],
    fontWeight: '500',
    fontSize: '16px',
    marginTop: '10px',
    padding: '10px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.colors.primary[900],
    },
  },
}));

export default useStyles;
