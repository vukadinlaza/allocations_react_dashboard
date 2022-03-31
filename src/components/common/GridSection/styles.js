import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  section: {
    padding: '30px 40px 0px 40px',
    borderBottom: 'solid 1px rgba(0, 0, 0, 0.12)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '28px',
    color: 'rgb(42,43,84,77%)',
  },
  fieldTitle: {
    fontWeight: 'bold',
    color: 'rgb(42,43,84,77%)',
    marginBottom: '8px',
  },
  fieldValue: {
    color: 'rgb(42,43,84,77%)',
  },
  dataContainer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '300px',
    width: '25%',
    marginBottom: '30px',
    padding: '0 10px',
  },
}));

export default useStyles;
