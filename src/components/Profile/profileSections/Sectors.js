import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
    width: '90%',
  },
  chip: {
    margin: theme.spacing(0.5),
    backgroundColor: 'red',
  },
}));

const Sectors = ({ investor }) => {
  const classes = useStyles();
  const [sectorData, setSectorData] = React.useState(investor.sectors);

  const handleDelete = (sectorToDelete) => () => {
    setSectorData((sectors) => sectors.filter((sector) => sector.key !== sectorToDelete.key));
  };

  return (
    <Paper component="ul" className={classes.root}>
      {sectorData.map((sector) => {
        return (
          <li key={sector}>
            <Chip label={sector} onDelete={handleDelete(sector)} className={classes.chip} />
          </li>
        );
      })}
    </Paper>
  );
};

export default Sectors;
