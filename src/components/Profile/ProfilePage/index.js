import React from 'react';
import { Paper, Grid, Avatar, Typography, Box } from '@material-ui/core';
import { gql, useQuery } from '@apollo/client';
import { colors } from '@allocations/design-system';
import { useParams, Redirect } from 'react-router-dom';
import { TiSocialLinkedinCircular } from 'react-icons/ti';
import useStyles from './styles';
import Loader from '../../utils/Loader';

const GET_PROFILE = gql`
  query GetInvestor($_id: String) {
    investor(_id: $_id) {
      first_name
      last_name
      country
      city
      state
      linkedinUrl
      profileImageKey
      profileBio
      sectors
      stages
    }
  }
`;

const ProfilePage = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: { _id: id },
  });

  if (loading) return <Loader />;

  if (error) return <Redirect to="/NotFound" />;

  return (
    <Paper>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item xs={12} style={{ marginBottom: 34 }}>
          <Avatar
            src={
              data.investor.profileImageKey
                ? `https://allocations-user-img.s3.us-east-2.amazonaws.com/${data.investor.profileImageKey}`
                : ''
            }
            className={classes.avatar}
          />
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Typography variant="h5" style={{ fontWeight: 'bold' }}>
            {data.investor.first_name} {data.investor.last_name}
          </Typography>
          <Typography variant="subtitle1">
            {data.investor.city}, {data.investor.country}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item className={classes.profileSection}>
          <Typography className={classes.profileSectionTitle} variant="h6">
            Bio
          </Typography>
          <Typography variant="body1">{data.investor.profileBio}</Typography>
        </Grid>
        <Grid container className={classes.profileSection}>
          <Grid item sm={6}>
            <Typography variant="h6" className={classes.profileSectionTitle}>
              Sectors
            </Typography>
            {data.investor.sectors?.map((sector, idx) => (
              <Box
                key={idx}
                borderRadius={5}
                color={colors.primary[600]}
                bgcolor={colors.primary[50]}
                paddingX="16px"
                paddingY="8px"
                mr="15px"
                mb="10px"
                display="inline-flex"
              >
                {sector}
              </Box>
            ))}
          </Grid>
          <Grid item sm={6}>
            <Typography variant="h6" className={classes.profileSectionTitle}>
              Deal Stages
            </Typography>
            {data.investor.stages?.map((stage, idx) => (
              <Box
                key={idx}
                borderRadius={5}
                color={colors.primary[600]}
                bgcolor={colors.primary[50]}
                paddingX="16px"
                paddingY="8px"
                mr="15px"
                mb="10px"
                display="inline-flex"
              >
                {stage}
              </Box>
            ))}
          </Grid>
        </Grid>
        <Grid container className={classes.profileSection}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" className={classes.profileSectionTitle}>
              Investments
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" className={classes.profileSectionTitle}>
              Links
            </Typography>
            {data.investor.linkedinUrl && (
              <a href={data.investor.linkedinUrl}>
                <TiSocialLinkedinCircular size={23} color={colors.primary[600]} />
              </a>
            )}
          </Grid>
        </Grid>
        <Grid item className={classes.profileSection} style={{ marginBottom: 90 }}>
          <Typography variant="h6" className={classes.profileSectionTitle}>
            Syndicates
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProfilePage;
