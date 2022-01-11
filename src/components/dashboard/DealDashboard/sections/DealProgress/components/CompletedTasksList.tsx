import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import blueCheck from '../../../../../../assets/blue-check-mark.svg';
import forYou from '../../../../../../assets/for-you-icon.svg';
import forAllocations from '../../../../../../assets/for-allocations-icon.svg';
import downArrow from '../../../../../../assets/keyboard_arrow_down.svg';
import upArrow from '../../../../../../assets/keyboard_arrow_up.svg';
import styles from '../../../styles';

interface task {
  _id: string;
  title: string;
  complete: boolean;
  phase: string;
  type: string;
}

interface completedTaskListProps extends WithStyles<typeof styles> {
  completedTasks: Array<task>;
}

const capitalizePhaseName = (phase: string) => {
  return phase
    .split('-')
    .reduce((acc, str) => {
      const capitalizedStr = str[0].toUpperCase() + str.slice(1);
      acc.push(capitalizedStr);
      return acc;
    }, [] as string[])
    .join('-');
};

const CompletedTasksList: React.FC<completedTaskListProps> = ({ completedTasks, classes }) => {
  const [openList, setOpenList] = useState<Boolean>(true);
  const toggleList = (): void => setOpenList((prev) => !prev);
  const list = completedTasks?.map(({ _id, phase, title, type }) => (
    <li key={_id} className={classes.completedTaskListItem}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={classes.completedTaskCheckImageContainer}>
          <img src={blueCheck} alt={'Blue check mark'} />
        </div>
        <Typography className={classes.completedTaskText}>
          {capitalizePhaseName(phase)}: {title}
        </Typography>
        {type.includes('fm') && <img src={forYou} alt={'For You Icon'} />}
        {type.includes('process-street') && (
          <img src={forAllocations} alt={'For Allocations Icon'} />
        )}
      </div>
    </li>
  ));

  return (
    <div style={{ marginTop: '50px' }}>
      <Typography className={classes.completedTaskToggle} onClick={toggleList}>
        Completed
        <img
          style={{ marginLeft: '10px' }}
          src={openList ? upArrow : downArrow}
          alt={'up or down arrow'}
        />
      </Typography>
      {openList && (
        <div>
          <ul style={{ listStyle: 'none', margin: '0px', padding: '0px' }}>{list}</ul>
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(CompletedTasksList);
