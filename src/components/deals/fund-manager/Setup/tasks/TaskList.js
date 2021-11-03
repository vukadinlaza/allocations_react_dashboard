import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid,
  ListItemIcon,
} from '@material-ui/core';
import { AiOutlineCheckCircle, AiFillCheckCircle } from 'react-icons/ai';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { withStyles } from '@material-ui/core/styles';
import styles from '../styles';

const TaskList = ({ tasks, classes, currentTask, handleTaskClick }) => {
  return (
    <Grid item sm={12} lg={4}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <List component="div" disablePadding>
            {tasks.map((task, i) => {
              const complete = task.complete;
              return (
                <ListItem
                  key={`phase-${i}`}
                  button
                  className={`${classes.listItem} ${complete && classes.listItemComplete}`}
                  onClick={() => handleTaskClick(currentTask, task)}
                >
                  <ListItemIcon>
                    {complete && <AiFillCheckCircle style={{ color: '#1be01e' }} size="1.75rem" />}
                    {!complete && <AiOutlineCheckCircle style={{ color: 'grey' }} size="1.75rem" />}
                  </ListItemIcon>

                  <ListItemText size="small" primary={task.title.toUpperCase()} />

                  {!task.type?.startsWith('admin') && (
                    <ListItemIcon className={classes.itemIcon}>
                      {currentTask === task ? (
                        <IoIosArrowBack size="1.2rem" />
                      ) : (
                        <IoIosArrowForward size="1.2rem" />
                      )}
                    </ListItemIcon>
                  )}
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default withStyles(styles)(TaskList);
