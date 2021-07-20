import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, gql } from '@apollo/client';
import { Link, Element } from 'react-scroll';
import handleViewport from 'react-in-viewport';
import { useHistory } from 'react-router-dom';
import { useFetch, useSimpleReducer } from '../../utils/hooks';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';
import BuildStep from './build';
import Landing from './landing';
import Completion from './completion';

const Block = (props) => {
  const { inViewport, forwardedRef } = props;
  const text = inViewport
    ? 'https://allocations-public.s3.us-east-2.amazonaws.com/Allocations_Logo_Final-white%402x.svg'
    : 'https://allocations-public.s3.us-east-2.amazonaws.com/allocations-logo.svg';
  useEffect(() => {
    props.setImg(text);
  });
  return <div className="viewport-block" ref={forwardedRef} />;
};
const ViewportBlock = handleViewport(Block);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '250px',
    height: '250px',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  img: {
    height: 150,
    width: '90%',
    marginBottom: 16,
    paddingRight: 32,
  },
  h5: {
    color: '#707070',
  },
  body: {
    color: '#707070',
  },
  button: {
    textTransform: 'capitalize',
    color: '#205DF5',
    fontSize: '1.4rem',
    marginLeft: -10,
    marginTop: 8,
  },
  blueContainer: {
    background: 'linear-gradient(180deg, rgba(32,93,245,1) 0%, rgba(0,94,255,1) 120px, rgba(255,255,255,1) 120px)',
    marginTop: '-30px',
    paddingTop: '30px',
    paddingBottom: '60px',
    marginLeft: '-32px',
    paddingLeft: '32px',
    marginRight: '-32px',
    paddingRight: '32px',
  },
  a: {
    minWidth: '100%',
  },
  modal: {
    display: 'flex',
    justifyContent: 'center',
  },
  modalPaper: {
    marginTop: '12vh',
    borderRadius: '.5rem',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  buildContainer: {
    minWidth: '100vw',
    minHeight: '100vh',
  },
}));
const GET_INVESTOR = gql`
  {
    investor {
      _id
      email
      first_name
      last_name
      admin
      deals {
        company_name
        airtableId
        status
      }
    }
  }
`;
const UPDATE_USER = gql`
  mutation UpdateUser($investor: UserInput!) {
    updateUser(input: $investor) {
      _id
    }
  }
`;

const BASE = 'appdPrRjapx8iYnIn';
const TABEL_NAME = 'Deals';
export default () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(1);
  const history = useHistory();
  const [img, setImg] = useState(
    'https://allocations-public.s3.us-east-2.amazonaws.com/Allocations_Logo_Final-white%402x.svg',
  );
  const { data: allATDeals } = useFetch(BASE, TABEL_NAME);
  const [updateInvestor] = useMutation(UPDATE_USER);

  const [data, setData] = useSimpleReducer({});

  const { userProfile, loading } = useAuth(GET_INVESTOR);

  useEffect(() => {
    if (!loading && userProfile._id) {
      updateInvestor({
        variables: {
          investor: { showBuild: true, _id: userProfile._id },
        },
      });
    }
  }, [loading, updateInvestor, userProfile]);

  useEffect(() => {
    if (allATDeals && userProfile) {
      const tableDeals = allATDeals.map((r) => ({ id: r.id, ...r.fields }));
      const activeDeal = tableDeals?.find((d) => d.userId === userProfile._id) || {};
      setData({ airtableId: activeDeal.id, ...activeDeal });
      setActiveStep(activeDeal.activeStep === 4 ? 1 : activeDeal.activeStep || 1);
    }
  }, [allATDeals, setData, userProfile]);
  if (!userProfile || !allATDeals) return <Loader />;
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <img
        src={img}
        style={{ position: 'fixed', width: '15%', marginLeft: '1rem' }}
        onClick={() => history.push('/')}
        alt="Allocations logo"
      />
      {activeStep ? <Completion deal={data} user={userProfile} /> : <Landing Link={Link} />}
      <Element id="anchor">
        <ViewportBlock setImg={setImg} />
      </Element>
      {activeStep <= 5 && (
        <div className={classes.buildContainer}>
          <BuildStep
            Element={Element}
            deal={data}
            user={userProfile}
            setData={setData}
            data={data}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        </div>
      )}
    </>
  );
};
