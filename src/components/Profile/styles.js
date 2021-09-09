const styles = (theme) => ({
  back: {
    color: '#2A2B54',
    cursor: 'pointer',
    padding: '6px 8px',
    '&:hover': {
      backgroundColor: '#8493A61A',
      borderRadius: '5px',
    },
  },

  button: {
    color: 'white',
    fontSize: '16px',
  },
  buttonUser: {
    color: '#0040FE',
    fontSize: '1rem',
    marginLeft: '1em',
    cursor: 'pointer',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#8493A61A',
    },
    '&:focus': {
      outline: 'none',
      border: 'none',
    },
  },

  // buttonsContainer: {
  //   display: 'flex',
  //   alignItems: 'center',
  // },

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
    fontSize: '16px',
    marginTop: '5px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#8493A61A',
      color: '#242973',
    },
    '&:focus': {
      outline: 'none',
      border: 'none',
    },
  },
  cellText: {
    color: '#2A2B54 !important',
  },
  contentContainer: {
    padding: '2rem',
    [theme.breakpoints.down('sm')]: {
      padding: '.5rem',
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
    background: 'white',
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
    color: '#a9a9a9',
    fontSize: '1.2rem',
    marginLeft: '0.5rem',
    '&:hover': {
      color: '#0462FF',
    },
  },
  fieldTitle: {
    fontWeight: 'bold',
    color: 'rgb(42,43,84,77%)',
    marginBottom: '8px',
  },
  fieldValue: {
    color: 'rgb(42,43,84,77%)',
  },

  formContainer: {
    backgroundColor: '#FBFCFF',
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
    [theme.breakpoints.down('sm')]: {
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
    color: 'rgb(42,43,84,77%)',
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
    color: '#2A2C54',
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
    color: 'white',
    backgroundColor: '#2A2B54',
    fontWeight: '500',
    fontSize: '16px',
    marginTop: '10px',
    padding: '10px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#242973',
      //     backgroundColor: '#2A2B54',
    },
  },
});

export default styles;
