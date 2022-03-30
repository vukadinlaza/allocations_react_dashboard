import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  dealData: {
    padding: '20px',
    margin: '10px 0px',
    '& a': {
      color: '#fff',
    },
  },
  closedDealsPaper: {
    marginTop: '16px',
  },
  closedDealsGrid: {
    padding: '16px',
  },
  closedDealRow: {
    '&:hover': {
      td: {
        backgroundColor: '#e6f9f3',
      },
    },
  },
  h5: {
    backgroundColor: '#e6f9f3',
    borderRadius: '5px 5px 0px 0px',
    padding: '10px',
    marginBottom: '0px',
    fontWeight: 400,
  },
  th: {
    fontWeight: 'bold',
  },
  dealsLength: {
    backgroundColor: '#21ce99',
    color: '#fff',
    display: 'inline-block',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    lineHeight: '30px',
    textAlign: 'center',
  },
  paginationGrid: {
    margin: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  prevButton: {
    marginLeft: '1rem',
    marginRight: '1rem',
  },
  paginationText: {
    fontSize: '1.25rem',
    marginLeft: '1rem',
    marginRight: '1rem',
  },
  nextButton: {
    marginLeft: '1rem',
    marginRight: '1rem',
  },
  linearProgress: {
    height: '20px',
  },
}));

export default useStyles;
