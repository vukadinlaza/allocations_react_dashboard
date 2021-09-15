import { phone, tablet } from '../../../utils/helpers';

const styles = (theme) => ({
  accredited: {
    borderRadius: '20px',
    background: '#39C522',
    marginLeft: '0.5em',
    display: 'flex',
    alignItems: 'center',
    padding: '2px 5px',
    minWidth: '50px',
    whiteSpace: 'nowrap',
    margin: '0 0.5em',
    '& svg': {
      fontSize: '10px',
    },
    [theme.breakpoints.down(phone)]: {
      margin: 0,
    },
  },
  avatar: {
    background: '#0461FF',
    fontSize: '14px',
    width: '30px',
    height: '30px',
    marginRight: '1em',
  },
  badgeComplete: {
    borderRadius: '100px',
    padding: '14px 18px',
    color: '#10C600',
    background: 'rgba(181, 241, 172, 1)',
  },
  badgeIncomplete: {
    borderRadius: '100px',
    padding: '14px',
    color: '#ff0404',
    background: 'rgba(255, 163, 163, 1)',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#39C522',
  },
  buttonContainer: {
    display: 'flex',
  },
  chartContainer: {
    width: '60%',
    padding: '5% 0',
    [theme.breakpoints.down(tablet)]: {
      padding: 0,
      width: '100%',
      marginBottom: '20px',
      height: '250px',
    },
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
  createButtonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '520px',
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
      marginBottom: '2em',
      width: '100%',
    },
  },
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'relative',
    width: '100%',
    left: '0',
    top: '0',
    background: 'white',
  },
  footerData: {
    fontSize: '14px',
  },
  investorBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff',
    marginBottom: '10px',
    borderRadius: '10px',
    padding: '10px',
    width: '100%',
    maxWidth: '100%',
    overflowX: 'hidden',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#edf1f4',
    },
  },
  investorBoxAmount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down(phone)]: {
      flexWrap: 'wrap',
      width: '100%',
    },
  },
  investorBoxName: {
    display: 'flex',
    alignItems: 'center',
    width: 'calc(100% - 80px)',
    [theme.breakpoints.down(phone)]: {
      width: '100%',
      marginBottom: '1em',
    },
  },
  investorName: {
    fontSize: '14px',
    maxWidth: 'calc(100% - 108px)',
    overflow: 'hidden',
    whiteSpace: 'pre',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down(phone)]: {
      width: '100%',
      marginBottom: '0.5em',
    },
  },
  loaderContainer: {
    top: '0',
    left: '0',
    width: '100%',
    height: '700px',
    display: 'flex',
    zIndex: 10,
    position: 'absolute',
    alignItems: 'flex-start',
    paddingTop: '180px',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255)',
  },
  logType: {
    width: 'fit-content',
    padding: '2px 12px',
    borderRadius: '20px',
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: '700',
    padding: '20px 0px',
    [theme.breakpoints.down(tablet)]: {
      display: 'none',
    },
  },
  mainTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0',
    padding: '0 0 25px 0',
    [theme.breakpoints.down(tablet)]: {
      justifyContent: 'center',
    },
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
    },
  },
  noDataPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '180px',
    height: 'calc(100vh - 140px)',
    fontSize: '26px',
    fontWeight: 600,
    color: '#c3c3c3',
    [theme.breakpoints.down(phone)]: {
      width: '80vw',
      margin: 'auto',
      height: '350px',
    },
  },
  pageIcons: {
    width: '150px',
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: '50px',
    [theme.breakpoints.down(phone)]: {
      width: '200px',
    },
  },
  pageIcon: {
    backgroundColor: '#0461FF',
    borderRadius: '100%',
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    '& *': {
      color: 'white',
      fontSize: '18px',
    },
    [theme.breakpoints.down(phone)]: {
      width: '40px',
      height: '40px',
      marginTop: '15px',
    },
  },
  playIcon: {
    '&:hover': {
      color: '#3f85f9',
    },
  },
  playIconDisabled: {
    color: '#205df5',
    opacity: '0.25',
  },
  progress: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  progressContainer: {
    height: 10,
    borderRadius: 5,
    width: '90%',
    marginRight: '1em',
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
    padding: '40px 0',
    margin: '0px',
    [theme.breakpoints.down(phone)]: {
      padding: '10px',
    },
  },
  selectedTab: {
    fontWeight: 'bold !important',
    '& $tabWrapper': {
      backgroundColor: 'rgb(32 93 245 / 16%)',
      borderRadius: '10px',
    },
  },
  setupStep: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 10px',
    cursor: 'pointer',
    '&:not(:first-child)': {
      borderTop: '1px solid #8493A640',
    },
    '&>*': {
      fontSize: '18px',
    },
    '&>p': {
      fontSize: '14px',
    },
    '&:hover': {
      backgroundColor: '#edf1fb',
    },
  },
  simpleBoxDataRow: {
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  sortField: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1rem 1rem -2rem 1rem',
    [theme.breakpoints.down(phone)]: {
      marginLeft: '22px',
      marginBottom: '5px',
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
  titleDataText: {
    margin: '0',
    fontSize: '14px',
    color: '#39C522',
    fontWeight: 'bold',
  },
});

export default styles;
