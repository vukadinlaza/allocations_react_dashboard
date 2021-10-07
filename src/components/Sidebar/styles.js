import { tablet } from '../../utils/helpers';

const styles = (theme) => ({
  addButton: {
    alignSelf: 'center',
    width: '80%',
    marginBottom: '20px',
    backgroundColor: '#186EFF',
    color: 'white',
  },
  appBar: {
    width: '100%',
    background: '#f7f7f7',
    color: '#868c97',
    boxShadow: 'none !important',
    position: 'relative',
    height: '100%',
    [theme.breakpoints.up(tablet)]: {
      display: 'none',
    },
  },
  brand: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandSpan: {
    height: '60px',
    width: '180px',
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  content: {
    background: 'rgba(0, 0, 0, 0.01)',
    height: ['100vh', 'calc(100vh - 70px)'],
    flexGrow: 1,
    padding: '2rem',
    maxWidth: 'calc(100% - 250px)',
    width: 'calc(100% - 250px)',
    overflowY: 'scroll',
    paddingBottom: '0',
    position: 'relative',
    [theme.breakpoints.up(tablet)]: {
      width: '100vw',
      padding: '1rem',
    },
  },
  contentContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    overflow: 'hidden',
    height: '100%',
    backgroundColor: '#f7f7f7',
  },
  drawer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRight: 'solid 1px #e4e3e3',
    [theme.breakpoints.up(tablet)]: {
      width: '100%',
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: '65%',
    paddingTop: 8,
    borderRight: 'none !important',
    borderLeft: 0,
    position: 'relative',
    height: '100%',
    backgroundColor: '#f7f7f7',
    background: '#f7f7f7',
  },
  formControl: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '80%',
    margin: '18px 0 10px 0',
    padding: '8px 10%',
    width: '100%',
    color: 'white',
    backgroundColor: 'rgb(27 54 96 / 8%)',
    '& svg': {
      color: '#1b3660',
    },
    '& *:before': {
      border: 'none !important',
    },
  },
  formItem: {
    borderBottom: '1px solid rgb(204, 204, 204)',
    fontWeight: 500,
  },
  icon: {
    minWidth: '40px',
    color: '#6b7686',
  },
  iconLabel: {
    fontSize: 900,
    color: '#6b7686',
  },
  input: {
    width: '100%',
    color: '#1b3660',
  },
  menuButton: {
    marginRight: '1rem',
    '&:focus': {
      outline: 'none',
    },
    [theme.breakpoints.up(tablet)]: {
      display: 'none',
    },
  },
  menuItem: {
    backgroundColor: 'transparent !important',
  },
  nested: {
    backgroundColor: 'transparent !important',
    paddingLeft: theme.spacing(8),
    color: '#6b7686',
  },
  newDrawer: {
    width: '100%',
    // paddingTop: 8,
    // border: 'none',
    // borderRight: '1px solid #dfe2e5',
    // borderLeft: 0,
    position: 'relative',
    height: '100vh',
  },
  newDrawerPaper: {
    width: '100%',
    paddingTop: 5,
    position: 'relative',
    height: '100%',
    background: 'white',
    // borderRight: 'solid 1px',
    border: 'none',
  },
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  secondHidden: {
    width: '100%',
    height: '100%',
  },
  sectionSideBarTitle: {
    fontWeight: 500,
    fontSize: '0.7rem',
    color: '#acb4c1',
    marginTop: '0.25rem',
  },
  select: {
    width: '90%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: '#f7f7f7',
    border: 'none !important',
  },
  sidebarDrawer: {
    width: '100%',
    marginTop: '1rem',
    padding: '0 5%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '80%',
    overflowY: 'scroll',
  },
  sidebarNavItem: {
    '&:hover': {
      backgroundColor: '#e7f0ff',
      borderRadius: '10px',
    },
    '& a': {
      color: '#707070',
      fontSize: '1.25rem',
    },
    '&:hover a': {
      textDecoration: 'none !important',
    },
    '&:hover *': {
      color: theme.palette.primary.main,
    },
  },
  sidebarNavItemActive: {
    backgroundColor: '#e7f0ff',
    color: theme.palette.primary.main,
    borderRadius: '10px',
    '& *': {
      color: theme.palette.primary.main,
    },
    '& a': {
      color: '#343f51 !important',
      fontWeight: 'bold',
      backgroundColor: '#e7f0ff',
      borderRadius: '0.75rem',
    },
    '& svg': {
      color: '#205df5',
    },
  },
});

export default styles;
