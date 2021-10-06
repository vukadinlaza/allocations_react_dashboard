import React from 'react';
import Typography from '@material-ui/core/Typography';
import useStyles from '../../../../BuildStyles';

export default function TypeItem({ item, handleChange, buildData }) {
  const classes = useStyles();

  return (
    <button
      type="button"
      name="asset_type"
      value={item.value}
      className={`${item.value === buildData.asset_type ? classes.selected : ''} ${
        classes.typeItem
      }`}
      onClick={handleChange}
    >
      <div
        style={{
          height: '55px',
          width: '55px',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={item.icon} alt={`${item.title} icon`} className={classes.icon} />
      </div>

      <Typography className={classes.assetItemText}>{item.title}</Typography>
      <Typography className={classes.subText}>{item.description}</Typography>
    </button>
  );
}