import React, { useState } from 'react';
import _, { pick, every } from 'lodash';
import {
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid,
  ListItemIcon,
  CardHeader,
  Divider,
  Typography,
  Button,
  TextField,
} from '@material-ui/core';
import { useQuery, gql } from '@apollo/client';
import { AiOutlineCheckCircle, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import AllocationsRocket from '../DealNextSteps/AllocationsRocket/AllocationsRocket';

const DEAL = gql`
  query getDealWithTasks($deal_id: String) {
    getDealWithTasks(deal_id: $deal_id) {
      _id
      metadata
      phases {
        _id
        name
        deal_id
        tasks {
          _id
          title
          description
          type
          complete
          done_by
          created_at
          updated_at
        }
      }
    }
  }
`;
const mainBoxes = () => {
  const data = [
    { value: 'Space X', title: 'Name' },
    { value: 'Kingsley Advani', title: 'Fund Manager' },
    { value: 'Pre-onboarding', title: 'Status' },
    { value: 'On Time', title: 'Timeline Status' },
    { value: 'International', title: 'Type' },
    { value: 'Wire Deadline', title: '12/3/2021' },
  ];
  const x = data.map((item) => {
    return (
      <Grid item sm={12} lg={2}>
        <Card>
          <CardContent style={{ fontWeight: '600' }}> {item.title}</CardContent>
          <Divider />
          <Typography style={{ fontSize: '1.25rem', padding: '16px' }}> {item.value}</Typography>
        </Card>
      </Grid>
    );
  });
  return x;
};
export default () => {
  const [currentPhase, setCurentPhase] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  const { data } = useQuery(DEAL, { variables: { deal_id: '614c9e8a0c74281a96566bc9' } });
  if (!data) return null;
  const { getDealWithTasks: deal } = data;
  console.log(deal);
  return (
    <>
      <Grid sm={12} lg={12} style={{ margin: '1.25rem 0 ', fontWeight: '900' }}>
        <Typography variant="h3">SPVs</Typography>
      </Grid>
      <Grid container spacing={1} style={{ margin: '2rem 0' }}>
        {mainBoxes()}
      </Grid>
      <Grid container spacing={1}>
        <Grid item sm={12} lg={4}>
          <Card>
            <CardContent>
              <List component="div" disablePadding>
                {deal.phases.map((p) => {
                  return (
                    <ListItem
                      button
                      className
                      onClick={() => {
                        setCurentPhase(currentPhase ? (p === currentPhase ? false : p) : p);
                        if (currentTask) {
                          setCurrentTask(false);
                        }
                      }}
                    >
                      <ListItemIcon>
                        <AiOutlineCheckCircle
                          style={{
                            color:
                              every(p.tasks, { complete: true }) || p.name === 'build'
                                ? '#1be01e'
                                : 'grey',
                          }}
                          size="1.75rem"
                        />
                      </ListItemIcon>
                      <ListItemText size="small" primary={_.capitalize(p.name)} />
                      <ListItemIcon
                        style={{
                          marginLeft: '.25rem',
                          display: 'flex',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {currentPhase === p ? (
                          <AiOutlineArrowLeft style={{}} size="1.2rem" />
                        ) : (
                          <AiOutlineArrowRight style={{}} size="1.2rem" />
                        )}
                      </ListItemIcon>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {currentPhase && (
          <Grid item sm={12} lg={4}>
            <Card>
              <CardContent>
                <List component="div" disablePadding>
                  {currentPhase?.tasks?.map((t, i) => {
                    return (
                      <ListItem
                        button
                        className
                        onClick={() =>
                          setCurrentTask(currentTask ? (t === currentTask ? false : t) : t)
                        }
                      >
                        <ListItemIcon>
                          <AiOutlineCheckCircle
                            style={{
                              color:
                                t.complete || currentPhase.name === 'build' ? '#1be01e' : 'grey',
                            }}
                            size="1.75rem"
                          />
                        </ListItemIcon>
                        <ListItemText size="small" primary={_.capitalize(t.title)} />
                        <ListItemIcon
                          style={{
                            marginLeft: '.25rem',
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          {currentTask === t ? (
                            <AiOutlineArrowLeft style={{}} size="1.2rem" />
                          ) : (
                            <AiOutlineArrowRight style={{}} size="1.2rem" />
                          )}
                        </ListItemIcon>
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
        {currentTask && (
          <Grid item sm={12} lg={4}>
            <Card>
              <CardContent>
                <Grid container spacing={1} direction="column" alignItems="center" justify="center">
                  <Grid item sm={12} lg={12}>
                    <Typography style={{ fontWeight: '600' }}>Edit {currentTask.title}</Typography>
                  </Grid>
                  <Grid item sm={12} lg={12} style={{ minWidth: '90%' }}>
                    <TextField style={{ minWidth: '100%' }} variant="outlined" />
                  </Grid>
                  <Grid item sm={12} lg={12} style={{ minWidth: '90%' }}>
                    <Button variant="contained" color="primary" style={{ minWidth: '100%' }}>
                      Save
                    </Button>{' '}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      <AllocationsRocket />
    </>
  );
};

// const bull = (
//   <Box
//     component="span"
//     sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
//   >
//     •
//   </Box>
// );

// const BasicCard = () => {
//   return (
//     <Card>
//       <CardContent>
//         <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//           Word of the Day
//         </Typography>
//         <Typography variant="h5" component="div">
//           be{bull}nev{bull}o{bull}lent
//         </Typography>
//         <Typography sx={{ mb: 1.5 }} color="text.secondary">
//           adjective
//         </Typography>
//         <Typography variant="body2">
//           well meaning and kindly.
//           <br />
//           {'"a benevolent smile"'}
//         </Typography>
//       </CardContent>
//       <CardActions>
//         <Button size="small">Learn More</Button>
//       </CardActions>
//     </Card>
//   );
// }
