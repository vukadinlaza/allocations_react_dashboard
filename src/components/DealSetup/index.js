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

const deal = {
  __typename: 'Deal',
  _id: '614c9e8a0c74281a96566bc9',
  metadata: {
    carry_fee: {
      type: 'percent',
      value: '20',
    },
    management_fee: {
      type: 'percent',
      value: '10',
    },
    _id: '614c9e8a0c74281a96566bc9',
    name: 'Super App SPV',
    slug: 'super-app-spv',
    organization_id: '5fa4547e0cbec80023baa4b7',
    legal_spv_name: 'Atomizer 38',
    master_series: 'Atomizers',
    asset_type: 'real-estate',
    portfolio_company_name: 'Tundra Trust',
    manager_name: 'Lance Merrill',
    closing_date: '2021-09-23T15:34:34.025Z',
    wire_deadline: '2021-09-23T15:34:34.025Z',
    sign_deadline: '2021-09-23T15:34:34.025Z',
    management_fee_frequency: 'one-time',
    setup_cost: 20000,
    side_letters: false,
    allocations_investment_advisor: true,
    custom_investment_agreement: false,
    offering_type: '506c',
    industry: 'Space',
    angels_deal: true,
    deal_multiple: 0,
    description: 'some description',
    memo: 'some memo',
    phase: 'build',
    createdAt: '2021-09-23T15:34:34.333Z',
    updatedAt: '2021-09-23T15:34:34.762Z',
    __v: 0,
    phases: [
      {
        _id: '614c9e8a0c74281a96566bcb',
        name: 'build',
        deal_id: '614c9e8a0c74281a96566bc9',
        tasks: [
          {
            title: 'Upload Company Deck',
            type: 'document',
            complete: true,
            _id: '614c9e8a0c74281a96566bcc',
            createdAt: '2021-09-23T15:34:34.436Z',
            updatedAt: '2021-09-23T15:34:34.436Z',
          },
          {
            title: 'Upload Company Logo',
            type: 'document',
            complete: true,
            _id: '614c9e8a0c74281a96566bcd',
            createdAt: '2021-09-23T15:34:34.436Z',
            updatedAt: '2021-09-23T15:34:34.436Z',
          },
          {
            title: 'Upload ID',
            type: 'document',
            complete: true,
            _id: '614c9e8a0c74281a96566bce',
            createdAt: '2021-09-23T15:34:34.436Z',
            updatedAt: '2021-09-23T15:34:34.436Z',
          },
          {
            title: 'Upload Term Sheet',
            type: 'document',
            complete: true,
            _id: '614c9e8a0c74281a96566bcf',
            createdAt: '2021-09-23T15:34:34.436Z',
            updatedAt: '2021-09-23T15:34:34.436Z',
          },
          {
            title: 'Upload Memorandum of Understanding',
            type: 'document',
            complete: true,
            _id: '614c9e8a0c74281a96566bd0',
            createdAt: '2021-09-23T15:34:34.436Z',
            updatedAt: '2021-09-23T15:34:34.436Z',
          },
          {
            title: 'Upload Service Agreement',
            type: 'document',
            complete: true,
            _id: '614c9e8a0c74281a96566bd1',
            createdAt: '2021-09-23T15:34:34.436Z',
            updatedAt: '2021-09-23T15:34:34.436Z',
          },
          {
            title: 'Review Documents',
            type: 'admin',
            complete: true,
            _id: '614c9e8a0c74281a96566bd2',
            createdAt: '2021-09-23T15:34:34.436Z',
            updatedAt: '2021-09-23T15:34:34.436Z',
          },
        ],
        createdAt: '2021-09-23T15:34:34.437Z',
        updatedAt: '2021-09-23T15:34:34.437Z',
        __v: 0,
      },
      {
        _id: '614c9e8a0c74281a96566bd3',
        name: 'post-build',
        deal_id: '614c9e8a0c74281a96566bc9',
        tasks: [
          {
            title: 'Upload SS4',
            type: 'document',
            complete: false,
            _id: '614c9e8a0c74281a96566bd4',
            createdAt: '2021-09-23T15:34:34.436Z',
            updatedAt: '2021-09-23T15:34:34.436Z',
          },
          {
            title: 'Fund Manager KYC',
            type: 'service',
            complete: false,
            _id: '614c9e8a0c74281a96566bd5',
            createdAt: '2021-09-23T15:34:34.436Z',
            updatedAt: '2021-09-23T15:34:34.436Z',
          },
          {
            title: 'Review Documents',
            type: 'admin',
            complete: false,
            _id: '614c9e8a0c74281a96566bd6',
            createdAt: '2021-09-23T15:34:34.437Z',
            updatedAt: '2021-09-23T15:34:34.437Z',
          },
        ],
        createdAt: '2021-09-23T15:34:34.437Z',
        updatedAt: '2021-09-23T15:34:34.437Z',
        __v: 0,
      },
      {
        _id: '614c9e8a0c74281a96566bd7',
        name: 'entity',
        deal_id: '614c9e8a0c74281a96566bc9',
        tasks: [
          {
            title: 'Create Entity',
            type: 'admin',
            complete: false,
            _id: '614c9e8a0c74281a96566bd8',
            createdAt: '2021-09-23T15:34:34.437Z',
            updatedAt: '2021-09-23T15:34:34.437Z',
          },
        ],
        createdAt: '2021-09-23T15:34:34.437Z',
        updatedAt: '2021-09-23T15:34:34.437Z',
        __v: 0,
      },
      {
        _id: '614c9e8a0c74281a96566bd9',
        name: 'post-entity',
        deal_id: '614c9e8a0c74281a96566bc9',
        tasks: [
          {
            title: 'Create Investment Agreement',
            type: 'service',
            complete: false,
            _id: '614c9e8a0c74281a96566bda',
            createdAt: '2021-09-23T15:34:34.437Z',
            updatedAt: '2021-09-23T15:34:34.437Z',
          },
          {
            title: 'Create Bank Account',
            type: 'admin',
            complete: false,
            _id: '614c9e8a0c74281a96566bdb',
            createdAt: '2021-09-23T15:34:34.437Z',
            updatedAt: '2021-09-23T15:34:34.437Z',
          },
          {
            title: 'Review',
            type: 'admin',
            complete: false,
            _id: '614c9e8a0c74281a96566bdc',
            createdAt: '2021-09-23T15:34:34.437Z',
            updatedAt: '2021-09-23T15:34:34.437Z',
          },
        ],
        createdAt: '2021-09-23T15:34:34.438Z',
        updatedAt: '2021-09-23T15:34:34.438Z',
        __v: 0,
      },
      {
        _id: '614c9e8a0c74281a96566bdd',
        name: 'pre-onboarding',
        deal_id: '614c9e8a0c74281a96566bc9',
        tasks: [
          {
            title: 'Pre-Sign Investment Agreement',
            type: 'service',
            complete: false,
            _id: '614c9e8a0c74281a96566bde',
            createdAt: '2021-09-23T15:34:34.437Z',
            updatedAt: '2021-09-23T15:34:34.437Z',
          },
          {
            title: 'Upload Wire Instructions',
            type: 'document',
            complete: false,
            _id: '614c9e8a0c74281a96566bdf',
            createdAt: '2021-09-23T15:34:34.437Z',
            updatedAt: '2021-09-23T15:34:34.437Z',
          },
          {
            title: 'Upload Investor List',
            type: 'document',
            complete: false,
            _id: '614c9e8a0c74281a96566be0',
            createdAt: '2021-09-23T15:34:34.437Z',
            updatedAt: '2021-09-23T15:34:34.437Z',
          },
          {
            title: 'Review Documents',
            type: 'admin',
            complete: false,
            _id: '614c9e8a0c74281a96566be1',
            createdAt: '2021-09-23T15:34:34.437Z',
            updatedAt: '2021-09-23T15:34:34.437Z',
          },
        ],
        createdAt: '2021-09-23T15:34:34.438Z',
        updatedAt: '2021-09-23T15:34:34.438Z',
        __v: 0,
      },
      {
        _id: '614c9e8a0c74281a96566be2',
        name: 'onboarding',
        deal_id: '614c9e8a0c74281a96566bc9',
        tasks: [
          {
            title: 'Onboarding Email',
            type: 'service',
            complete: false,
            _id: '614c9e8a0c74281a96566be3',
            createdAt: '2021-09-23T15:34:34.437Z',
            updatedAt: '2021-09-23T15:34:34.437Z',
          },
        ],
        createdAt: '2021-09-23T15:34:34.438Z',
        updatedAt: '2021-09-23T15:34:34.438Z',
        __v: 0,
      },
    ],
    id: '614c9e8a0c74281a96566bc9',
  },
  phases: [
    {
      __typename: 'Phase',
      _id: '614c9e8a0c74281a96566bcb',
      deal_id: '614c9e8a0c74281a96566bc9',
      name: 'build',
      tasks: [
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bcc',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Upload Company Deck',
          type: 'document',
          updated_at: null,
        },
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bcd',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Upload Company Logo',
          type: 'document',
          updated_at: null,
        },
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bce',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Upload ID',
          type: 'document',
          updated_at: null,
        },
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bcf',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Upload Term Sheet',
          type: 'document',
          updated_at: null,
        },
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bd0',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Upload Memorandum of Understanding',
          type: 'document',
          updated_at: null,
        },
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bd1',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Upload Service Agreement',
          type: 'document',
          updated_at: null,
        },
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bd2',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Review Documents',
          type: 'admin',
          updated_at: null,
        },
      ],
    },
    {
      __typename: 'Phase',
      _id: '614c9e8a0c74281a96566bd3',
      deal_id: '614c9e8a0c74281a96566bc9',
      name: 'post-build',
      tasks: [
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bd4',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Upload SS4',
          type: 'document',
          updated_at: null,
        },
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bd5',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Fund Manager KYC',
          type: 'service',
          updated_at: null,
        },
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bd6',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Review Documents',
          type: 'admin',
          updated_at: null,
        },
      ],
    },
    {
      __typename: 'Phase',
      _id: '614c9e8a0c74281a96566bd7',
      deal_id: '614c9e8a0c74281a96566bc9',
      name: 'entity',
      tasks: [
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bd8',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Create Entity',
          type: 'admin',
          updated_at: null,
        },
      ],
    },
    {
      __typename: 'Phase',
      _id: '614c9e8a0c74281a96566bd9',
      deal_id: '614c9e8a0c74281a96566bc9',
      name: 'post-entity',
      tasks: [
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bda',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Create Investment Agreement',
          type: 'service',
          updated_at: null,
        },
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bdb',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Create Bank Account',
          type: 'admin',
          updated_at: null,
        },
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bdc',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Review',
          type: 'admin',
          updated_at: null,
        },
      ],
    },
    {
      __typename: 'Phase',
      _id: '614c9e8a0c74281a96566bdd',
      deal_id: '614c9e8a0c74281a96566bc9',
      name: 'pre-onboarding',
      tasks: [
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bde',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Pre-Sign Investment Agreement',
          type: 'service',
          updated_at: null,
        },
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566bdf',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Upload Wire Instructions',
          type: 'document',
          updated_at: null,
        },
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566be0',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Upload Investor List',
          type: 'document',
          updated_at: null,
        },
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566be1',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Review Documents',
          type: 'admin',
          updated_at: null,
        },
      ],
    },
    {
      __typename: 'Phase',
      _id: '614c9e8a0c74281a96566be2',
      deal_id: '614c9e8a0c74281a96566bc9',
      name: 'onboarding',
      tasks: [
        {
          __typename: 'Task',
          _id: '614c9e8a0c74281a96566be3',
          complete: false,
          created_at: null,
          description: null,
          done_by: null,
          title: 'Onboarding Email',
          type: 'service',
          updated_at: null,
        },
      ],
    },
  ],
};

export default () => {
  const [currentPhase, setCurentPhase] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  // const { data } = useQuery(DEAL, { variables: { deal_id: '614c9e8a0c74281a96566bc9' } });
  // if (!data) return null;
  // const { getDealWithTasks: deal } = data;
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
