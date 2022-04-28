import { makeStyles } from '@material-ui/core/styles';
import { phone, tablet } from '../../../utils/helpers';

const useStyles = makeStyles((theme) => ({
  accredited: {
    borderRadius: '20px',
    background: theme.colors.success[500],
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
    background: theme.colors.primary[600],
    fontSize: '14px',
    width: '30px',
    height: '30px',
    marginRight: '1em',
  },
  badgeComplete: {
    borderRadius: '100px',
    padding: '14px 18px',
    color: theme.colors.success[700],
    background: theme.colors.success[100],
  },
  badgeIncomplete: {
    borderRadius: '100px',
    padding: '14px',
    color: theme.colors.error[600],
    background: theme.colors.error[300],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: theme.colors.success[500],
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
  containedButton: {
    background: theme.colors.primary[500],
    color: theme.colors.white[100],
    borderRadius: '8px',
    padding: '6px 16px',
    fontSize: '12px',
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
    [theme.breakpoints.down(phone)]: {
      fontSize: '.5rem',
    },
  },
  createButtonLink: {
    [theme.breakpoints.down(phone)]: {
      marginBottom: '1em',
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
    background: theme.colors.gray[50],
    [theme.breakpoints.down(phone)]: {
      maxWidth: '100vw',
    },
  },
  dealSection: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: theme.colors.white[100],
    height: '68px',
    borderRadius: '8px',
    margin: '30px',
    [theme.breakpoints.down(phone)]: {
      height: '90px',
    },
  },
  dealsTitle: {
    marginBottom: '28px',
  },
  footerData: {
    fontSize: '14px',
  },
  investorBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.colors.white[100],
    marginBottom: '10px',
    borderRadius: '10px',
    padding: '10px',
    width: '100%',
    maxWidth: '100%',
    overflowX: 'hidden',
    '&:hover': {
      backgroundColor: theme.colors.gray[100],
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
  linkText: {
    width: '50%',
    fontSize: '14px',
    marginLeft: '15px',
    [theme.breakpoints.down(phone)]: {
      overflowWrap: 'anywhere',
      width: '70%',
    },
  },
  loaderContainer: {
    top: '0',
    left: '0',
    width: '100%',
    height: '100vh',
    display: 'flex',
    zIndex: 10,
    position: 'absolute',
    alignItems: 'flex-start',
    paddingTop: '180px',
    justifyContent: 'center',
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
    padding: '5px 5px 10px 5px',
    [theme.breakpoints.down(tablet)]: {
      justifyContent: 'center',
    },
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
    },
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalListItem: {
    display: 'flex',
    fill: 'black',
    alignItems: 'center',
    '&:hover, &:focus, &active': {
      background: theme.colors.primary[50],
      color: theme.colors.primary[500],
      '& svg': {
        fill: theme.colors.primary[500],
      },
    },
  },
  modalSVG: {
    fill: theme.colors.black[50],
    width: '15px',
    margin: '10px',
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
    color: theme.colors.gray[300],
    [theme.breakpoints.down(phone)]: {
      width: '80vw',
      margin: 'auto',
      height: '350px',
    },
  },
  outlinedButton: {
    border: `1px solid ${theme.colors.gray[300]}`,
    borderRadius: '8px',
    color: theme.colors.gray[500],
    padding: '6px 16px',
    fontSize: '12px',
  },
  pageIcons: {
    display: 'flex',
    width: '50%',
    justifyContent: 'space-evenly',
  },
  pageIcon: {
    backgroundColor: theme.colors.primary[600],
    borderRadius: '100%',
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    '& *': {
      color: theme.colors.white[100],
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
      color: theme.colors.primary[300],
    },
  },
  playIconDisabled: {
    color: theme.colors.primary[600],
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
  routingModal: {
    display: 'grid',
    gridTemplateRows: 'repeat(3, 1fr)',
    width: '90%',
    height: '120px',
    filter: 'drop-shadow(0px 20px 56px rgba(0, 0, 0, 0.29))',
    borderRadius: '8px',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '25px',
    background: theme.colors.white[100],
    padding: '15px 20px',
    border: 'none',
    boxShadow: 'none',
    borderRadius: '8px',
  },
  section: {
    width: '100%',
    padding: '24px 0',
    margin: '0px',
    [theme.breakpoints.down(phone)]: {
      padding: '10px',
    },
  },
  selectedTab: {
    fontWeight: 'bold !important',
    '& $tabWrapper': {
      backgroundColor: theme.colors.primary[600] + '25',
      borderRadius: '10px',
    },
  },
  setupStep: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 10px',
    cursor: 'pointer',
    '&:not(:first-child)': {
      borderTop: `1px solid ${theme.colors.gray[200]}`,
    },
    '&>*': {
      fontSize: '18px',
    },
    '&>p': {
      fontSize: '14px',
    },
    '&:hover': {
      backgroundColor: theme.colors.primary[50],
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
    margin: '1rem 1rem 0 1rem',
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
  titleContainer: {
    padding: '0 8px',
    marginBottom: '44px',
  },
  bankingAllocateWrapper: {
    width: '100%',
    border: `1px solid ${theme.colors.gray[200]}`,
    display: 'flex',
    padding: '15px 20px',
    background: theme.colors.white[100],
    boxShadow: '0px 3px 5px -5px',
    alignItems: 'center',
    borderRadius: '3px',
    marginBottom: '25px',
    justifyContent: 'space-between',
  },
  titleDataText: {
    margin: '0',
    fontSize: '14px',
    color: theme.colors.success[500],
    fontWeight: 'bold',
  },
}));

export default useStyles;
