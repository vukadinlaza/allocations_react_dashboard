import React from 'react';
import _ from 'lodash';
import { gql } from 'apollo-boost';
import {
  Grid,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import Box from '@material-ui/core/Box';
import CheckIcon from '@material-ui/icons/Check';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDisplayName } from '../../../../utils/displayName';
import { nWithCommas } from '../../../../utils/numbers';
import Loader from '../../../utils/Loader';

const demoNames = [
  'Pablo Picasso',
  'Vincent van Gogh',
  'Leonardo da Vinci',
  'Claude Monet',
  'Salvador Dali',
  'Henri Matisse',
  'Rembrandt',
  'Andy Warhol',
  "Georgia O'Keeffe",
  'Michelangelo',
  'Peter Paul Rubens',
  'Edgar Degas',
  'Caravaggio',
  'Pierre-Auguste Renoir',
  'Raphael',
  'Paul Cezanne',
  'Marc Chagall',
  'Titian',
  'Joan Miro',
  'Jackson Pollock',
  'Gustav Klimt',
  'Albrecht Durer',
  'Edward Hopper',
  'Wassily Kandinsky',
  'Jan Vermeer',
  'Paul Klee',
  'Edvard Munch',
  'Goya',
  'Janet Fish',
  'Edouard Manet',
];

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: '16px -16px',
  },
  board: {
    width: '100%',
    backgroundColor: '##FBFCFC',
    boxShadow: 'none',
    border: '1px solid #70707040',
    borderRadius: '12px',
  },
  avatar: {
    margin: '0.25rem',
    height: 26,
    width: 26,
    background: '#00A0C6',
  },
  list: {
    padding: '8px',
  },
  listItem: {
    backgroundColor: '#F7F9FA',
    borderRadius: '12px',
    marginBottom: 6,
  },
}));

const boardData = [
  { title: 'Viewed', key: 'invited' },
  { title: 'Signed', key: 'signed' },
  { title: 'Wired', key: 'wired' },
  { title: 'Completed', key: 'complete' },
];

export const DEAL_INVESTMENTS = gql`
  query deal($_id: String!) {
    deal(_id: $_id) {
      _id
      investments {
        status
        amount
        investor {
          email
          documents
        }
      }
    }
  }
`;

export default ({ dealId, isDemo }) => {
  const classes = useStyles();
  const { data, loading } = useQuery(DEAL_INVESTMENTS, {
    variables: { _id: dealId },
    pollInterval: 500,
  });
  const investments = data?.deal?.investments.map((inv) => {
    const hasKycDoc = inv.investor?.documents?.find(
      (d) => d.documentName && (d.documentName.includes('W-8') || d.documentName.includes('W-9')),
    );
    return { ...inv, hasKycDoc };
  });
  const groupedInvestments = _.groupBy(investments, 'status');

  let categories =
    boardData.map((type) => {
      const categoryInvestments = groupedInvestments[type.key] || [];
      const totalAmount = _.sumBy(categoryInvestments, 'amount');
      return { ...type, categoryInvestments, totalAmount };
    }) || [];
  if (isDemo) {
    categories = categories.map((cat) => {
      const demoInvestments = cat?.categoryInvestments.map((inv) => {
        return {
          ...inv,
          amount: _.random(5000, 250000),
          investor: {
            ...inv.investor,
            email: `${_.sample(demoNames)}@`,
          },
        };
      });
      return {
        ...cat,
        totalAmount: _.sumBy(demoInvestments, 'amount'),
        categoryInvestments: demoInvestments,
      };
    });
  }

  if (loading) return <Loader />;

  return (
    <Grid container spacing={2} justify="space-between">
      {categories.map((value) => (
        <Grid key={value.title} item xs={12} sm={3}>
          <Box height="100%" className={classes.board}>
            <Grid container direction="row" justify="space-between">
              <Typography
                variant="h6"
                display="inline"
                style={{ padding: '8px', textTransform: 'uppercase', fontSize: '16px', maxWidth: '50%' }}
              >
                {value.title}
              </Typography>
              <Typography
                variant="h6"
                display="inline"
                style={{
                  padding: '8px',
                  textTransform: 'uppercase',
                  fontSize: '16px',
                  maxWidth: '50%',
                  color: '#39BE53',
                }}
              >
                <FontAwesomeIcon icon="dollar-sign" size="sm" style={{ marginRight: '.15rem' }} />
                {nWithCommas(value.totalAmount)}
              </Typography>
            </Grid>
            <List dense className={classes.list}>
              {value?.categoryInvestments?.map((inv) => (
                <InvestmentSquare investment={inv} isDemo={isDemo} />
              ))}
            </List>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
const InvestmentSquare = ({ investment, isDemo }) => {
  console.log(investment);
  const classes = useStyles();
  const n = _.get(investment, 'investor.email', '').split('@');
  const name = _.get(n, '[0]', '');
  return (
    <ListItem disableGutters className={classes.listItem}>
      <ListItemAvatar>
        <Avatar alt={name} className={classes.avatar}>
          {name.charAt(0).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} primary={name} />
      <ListItemSecondaryAction>
        <FontAwesomeIcon icon="dollar-sign" size="sm" style={{ marginRight: '.15rem' }} />
        {nWithCommas(investment.amount || '0')}
      </ListItemSecondaryAction>
    </ListItem>
  );
};
