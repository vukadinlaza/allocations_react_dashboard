import React from 'react';
import Typography from '@material-ui/core/Typography';
import check from '../../../../../../assets/check-mark-blue.svg';
import useStyles from '../../../../BuildStyles';

export default function TypeItem({ item, handleChange, buildData }) {
  const classes = useStyles();

  return (
    <button
      type="button"
      name="asset_type"
      value={item.value}
      className={`${item.value === buildData.asset_type ? classes.typeItemSelected : ''} ${
        classes.typeItem
      }`}
      onClick={handleChange}
    >
      <div className={classes.typeItemDiv}>
        <img src={item.icon} alt={`${item.title} icon`} className={classes.icon} />
        {buildData.asset_type === item.value && (
          <div className={classes.blueCheck}>
            <img alt="blue check mark" src={check} />
          </div>
        )}
      </div>

      <Typography className={classes.assetItemText}>{item.title}</Typography>
      <Typography className={classes.subText}>{item.description}</Typography>
    </button>
  );
}
