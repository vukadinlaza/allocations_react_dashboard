import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles<Theme, { isAuthenticated: boolean }>((theme) => ({
  app: {
    [theme.breakpoints.up('md')]: {
      display: ({ isAuthenticated }) => (isAuthenticated ? 'grid' : 'block'),
      height: '100%',
    },
    gridTemplateColumns: ({ isAuthenticated }) =>
      isAuthenticated ? 'minmax(250px, 10%) auto' : 'auto',
    gridTemplateAreas: ({ isAuthenticated }) =>
      isAuthenticated ? `'sidebar mainRoute'` : `'mainRoute'`,
    gridTemplateRows: ({ isAuthenticated }) => (isAuthenticated ? '100%' : ''),
    // padding: '0.5rem',
    display: 'block',
  },
  mainRoute: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: '#f8fafc',
    justifyContent: ({ isAuthenticated }) => (isAuthenticated ? 'center' : ''),
    padding: ({ isAuthenticated }) => (isAuthenticated ? '0.5rem 3rem' : '2rem 3rem'),
  },
  sidebar: {
    gridArea: 'sidebar',
    zIndex: 999,
  },
}));

export default useStyles;
