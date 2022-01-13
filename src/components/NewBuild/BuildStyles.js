import { makeStyles } from '@material-ui/core/styles';
import { phone } from '../../utils/helpers';

const useStyles = makeStyles((theme) => ({
  // * Styles that are used in more than one place in the build form
  root: {
    display: 'flex',
    '& > *': {
      width: '267px',
      height: '166px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#7070703B',
    },
  },
  activeOuterSection: {
    borderLeft: 'solid #ECF3FF 3px',
    [theme.breakpoints.down(phone)]: {
      borderLeft: 'none',
    },
  },
  assetItemText: {
    font: 'normal normal normal 18px/21px Roboto',
    color: '#2A2B54',
    letterSpacing: '0px',
    textAlign: 'left',
    opacity: '1',
    [theme.breakpoints.down(phone)]: {
      margin: '0',
    },
  },
  buildTabContainer: {
    backgroundColor: 'inherit',
    boxShadow: 'none !important',
    width: '100%',
    maxWidth: '1352px',
    opacity: 1,
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down(phone)]: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: '0',
    },
  },
  cancelIcon: {
    position: 'relative',
    right: '-120px',
    top: '-10px',
    zIndex: 1,
    color: '#4a4a4a',
    cursor: 'pointer',
    transition: '0.5s',
    '&:hover': {
      color: '#e71a1a',
    },
  },
  continueButton: {
    font: 'normal normal bold 24px/28px Roboto',
    marginTop: '5px',
    width: '350px',
    height: '60px',
    margin: 'auto',
    background: '#186EFF 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    opacity: '1',
    color: '#FFFFFF',
    textTransform: 'none',
    outline: 'none',
    [theme.breakpoints.down(phone)]: {
      width: '300px',
    },
  },
  finalInput: {
    width: '100%',
    height: 'auto',
    minHeight: '167px',
    maxWidth: '1190px',
    padding: '0',
  },
  finalInputBox: {
    width: '100%',
    minHeight: '167px',
    maxWidth: '1190px',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000A',
    border: '1px solid #70707040',
    borderRadius: '5px',
    padding: '0',
    marginBottom: '37px',
  },
  formContainers: {
    width: '100%',
  },
  formItemName: {
    color: '#2A2B54',
    font: 'normal normal bold 17px/20px Roboto',
    marginBottom: '20px',
    borderRadius: '8px',
    [theme.breakpoints.down(phone)]: {
      marginBottom: '14px',
      maxWidth: '95%',
    },
  },
  helpIcon: {
    marginLeft: '0.2em',
    cursor: 'pointer',
    color: '#205DF5',
    fontSize: '15px',
  },
  icon: {
    opacity: '1',
  },
  inputBox: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000A',
    borderRadius: '8px !important',
    padding: '0',
    maxWidth: '568px',
    width: '100%',
  },
  inputGridContainer: {
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
    },
  },
  basicInformationInputItem: {
    [theme.breakpoints.down(phone)]: {
      maxWidth: '100%',
      maxHeight: '130px',
    },
  },
  inputGridItem: {
    marginBottom: '30px',
    height: 'fit-content',
    [theme.breakpoints.down(phone)]: {
      maxWidth: '100%',
      // maxHeight: '125px',
    },
  },
  inputLabelWithTooltip: {
    display: 'flex',
    '& svg': {
      marginTop: '0.2em',
    },
  },
  itemText: {
    font: 'normal normal normal 18px/21px Roboto',
    color: '#2A2B54',
    letterSpacing: '0px',
    opacity: '1',
    paddingLeft: '30px',
    [theme.breakpoints.down(phone)]: {
      font: 'normal normal normal 16px/21px Roboto',
      maxWidth: '180px',
      paddingLeft: '15px',
    },
  },
  outerSection: {
    padding: '18px 50px',
    marginLeft: '12px',
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.down(phone)]: {
      padding: '0px',
      marginLeft: '0px',
    },
  },
  paper: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #7070703B',
    marginBottom: '16px',
    borderRadius: '15px',
    padding: '42px',
    width: '100%',
    maxWidth: '1352px',
    opacity: 1,
    overflow: 'visible',
    [theme.breakpoints.down(phone)]: {
      maxWidth: '600px',
      marginBottom: '24px',
      padding: '16px',
      paddingBottom: '30px',
    },
  },
  previousButton: {
    font: 'normal normal normal 24px/28px Roboto',
    marginTop: '11px',
    padding: '5px',
    cursor: 'pointer',
    [theme.breakpoints.down(phone)]: {
      marginBottom: '14px',
      marginTop: '0px',
      marginLeft: '0',
      width: '100%',
      textAlign: 'center',
    },
  },
  removeSectorButton: {
    display: 'flex',
    height: '100%',
    marginLeft: '3px',
    alignItems: 'center',
    color: '#0461ff',
    backgroundColor: '#DAE8FF',
    border: 'none',
    borderRadius: '0px 4px 4px 0px',
    fontWeight: '600',
    fontSize: '10px',
    //* TO DO: fix on hover - need to fit height
    '&:hover': {
      backgroundColor: '#FFBDAD',
      color: '#DE350B',
    },
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  sectionHeaderNumber: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '50%',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '19px',
    margin: '0px 12px 6px 0px',
  },
  sectionHeaderText: {
    fontSize: '24px',
    display: 'flex',
    margin: '0px 0px 6px 0px',
    [theme.breakpoints.down(phone)]: {
      fontSize: '24px',
    },
  },
  sectorTag: {
    display: 'flex',
    color: '#0461ff',
    backgroundColor: '#DAE8FF',
    fontSize: '85%',
    margin: '3px',
    height: '25px',
    paddingLeft: '6px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    borderRadius: '4px',
    alignItems: 'center',
  },
  selectorButton: {
    fontSize: '.8em',
    color: '#8E9394',
    height: '60px',
    border: '1px solid #d3d3d3 !important',
    backgroundColor: '#ffffff',
    borderRadius: '8px !important',
    textTransform: 'capitalize',
    '& .MuiButtonGroup-groupedOutlinedHorizontal:not(:last-child) ': {
      border: 'none !important',
    },
    '& .MuiButton-outlinePrimary': {
      border: 'none !important',
    },
    [theme.breakpoints.down(phone)]: {
      fontSize: '.7em',
    },
  },
  selected: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    color: '#186EFF !important',
    background: '#ECF3FF 0% 0% no-repeat padding-box !important',
    boxShadow: '0px 3px 6px #0000000D !important',
    border: '2px solid #186EFF !important',
    borderRadius: '8px !important',
    textTransform: 'capitalize',
    opacity: '1 !important',
  },
  subText: {
    textAlign: 'left',
    font: 'normal normal normal 12px/14px Roboto',
    paddingBottom: '5px',
    letterSpacing: '0px',
    color: '#186EFF',
    width: '202px',
    opacity: 1,
  },
  typeItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: '12px',
    width: '100%',
    height: '166px',
    minHeight: '166px',
    background: '#EBEBEB 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000D',
    border: '2px solid #E5E5E5',
    borderRadius: '10px',
    cursor: 'pointer',
    [theme.breakpoints.down(phone)]: {
      width: '325px',
    },
    '& *': {
      pointerEvents: 'none',
    },
  },
  typeItemDiv: {
    width: '100%',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeItemSelected: {
    extend: 'selected',
    textTransform: 'inherit',
    border: '2px solid #186EFF !important',
    background: '#ECF3FF 0% 0% no-repeat padding-box !important',
  },
  unfilledField: {
    border: '1px solid red',
  },
  // * Styles that are only used in the SPV form
  cryptoFieldset: {
    border: 'solid 1px #186EFF',
    borderTopColor: '#186EFF',
    borderRadius: '8px',
    boxSizing: 'border-box',
    width: 'inherit',
    paddingLeft: '10px',
    [theme.breakpoints.down(phone)]: {
      paddingLeft: '0px',
    },
  },
  cryptoFormContainer: {
    width: '100%',
    right: '1vw',
  },
  cryptoLabel: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: '#2A2B54',
    width: 'fit-content',
    padding: '0px 5px',
    marginLeft: '5px',
    [theme.breakpoints.down(phone)]: {
      padding: '0px',
      marginLeft: '0px',
    },
  },
  cryptoSelector: {
    width: '110%',
    padding: '8px 11px 17px 5px',
  },
  customInputGridItem: {
    marginBottom: '37px',
    [theme.breakpoints.down(phone)]: {
      maxWidth: '100%',
      marginBottom: '0px',
    },
  },
  minimumInput: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000A',
    padding: '0',
    maxWidth: '464px',
    width: '100%',
  },
  pitchDeckCheckbox: {
    paddingLeft: '0px',
    height: '24px',
    width: '24px',
    borderRadius: '4px',
  },
  pitchDeckColorSecondary: {
    color: '#39C522',
  },
  selectInputBox: {
    width: '90%',
    // maxWidth: '460px',
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderRadius: '8px !important',
    },
    [theme.breakpoints.down(phone)]: {
      width: '100%',
    },
  },
  // * Styles that are only used in the AgreementSigner.
  agreementSignedBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100px',
    paddingLeft: '30px',
    paddingRight: '30px',
    border: 'none !important',
    borderRadius: '20px',
    boxShadow: 'none !important',
    backgroundColor: '#F6F7F8',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    [theme.breakpoints.down(phone)]: {
      paddingLeft: '15px',
      paddingRight: '15px',
      border: '2px solid #186EFF !important',
      backgroundColor: 'rgba(26, 110, 255, 0.16)',
    },
  },
  agreementUnsignedBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100px',
    paddingLeft: '30px',
    paddingRight: '30px',
    border: '2px dashed #0461FF !important',
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    [theme.breakpoints.down(phone)]: {
      paddingLeft: '15px',
      paddingRight: '15px',
      border: '2px solid #2A2B54 !important',
    },
  },
  buttonBox: {
    margin: 'auto',
    marginTop: '40px',
    alignSelf: 'center',
    textAlign: 'center',
    [theme.breakpoints.down(phone)]: {
      marginTop: '0px',
    },
  },
  customFormItemName: {
    minHeight: '45px',
  },
  notSigned: {
    backgroundColor: '#FFBDAD',
    color: '#DE350B',
    fontWeight: '600',
    borderRadius: '20px',
    padding: '5px 20px',
    [theme.breakpoints.down(phone)]: {
      padding: '4px 10px',
    },
  },
  servicesAgreementIconBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#ECF3FF',
    [theme.breakpoints.down(phone)]: {
      width: '45px',
      height: '45px',
      backgroundColor: 'white',
    },
  },
  signContainer: {
    display: 'grid',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #7070703B',
    marginBottom: '16px',
    borderRadius: '15px',
    padding: '42px',
    width: '100%',
    maxWidth: '1352px',
    gridGap: '30px',
    opacity: 1,
    [theme.breakpoints.down(phone)]: {
      maxWidth: '600px',
      marginBottom: '24px',
      padding: '16px',
      paddingBottom: '30px',
    },
  },
  signed: {
    backgroundColor: 'rgb(57,197,34, 0.23)',
    color: '#34AF1F',
    fontWeight: '600',
    borderRadius: '20px',
    padding: '5px 20px',
    [theme.breakpoints.down(phone)]: {
      padding: '4px 10px',
    },
  },
  subtitle: {
    textAlign: 'left',
    font: 'normal normal normal 16px/19px Roboto',
    letterSpacing: '0px',
    color: '#186EFF',
    opacity: '1',
    marginBottom: '41px',
    [theme.breakpoints.down(phone)]: {
      marginTop: '20px',
      marginBottom: '20px',
    },
  },
  formHeaderText: {
    padding: '36px 0px 27px 8px',
    color: '#2A2B54',
    fontSize: '22px',
    [theme.breakpoints.down(phone)]: {
      fontSize: '20px',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },

  // 1. Styles that are used exclusively in the 'Type Selector' tab.
  assetChoiceGrid: {
    display: 'flex',
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  assetTypeRowItem: {
    paddingBottom: '16px',
    paddingRight: '24px',
    [theme.breakpoints.down(phone)]: {
      paddingRight: '0',
    },
  },
}));

export default useStyles;
