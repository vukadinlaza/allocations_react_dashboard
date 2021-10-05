import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircle from '../../../../../assets/check_circle_black_24dp.svg';
import buildDoc from '../../../../../assets/buildDoc.svg';
import useStyles from '../../../BuildStyles';
import { gql, useQuery } from '@apollo/client';

const SERVICE_AGREEMENT_LINK = gql`
  query serviceAgreementLink($deal_id: String) {
    serviceAgreementLink: getServiceAgreementLink(deal_id: $deal_id) {
      dataRequestId: id
      tokenId: token_id
      tokenSecret: token_secret
    }
  }
`;

const signingModal = (serviceAgreementLink) => {
  // eslint-disable-next-line no-undef
  DocSpring.createVisualForm({
    dataRequestId: 'drq_hgyjTsK5bt6YFk9dCs',
    tokenId: 'jb92cfg36EFzjQphd6',
    tokenSecret: 'bYy2DS3JabgTRgJAXknbEhmrKAJXnDer',
    domainVerification: false,
  });
};

export default function SignDocsForm({ page, setPage, deal }) {
  const classes = useStyles();
  const [iconsChecked, setIconsChecked] = useState({ one: true, two: true });
  const { data } = useQuery(SERVICE_AGREEMENT_LINK, { variables: { deal: deal._id } });

  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
          Sign your agreements
        </Typography>
        <Typography variant="h6" gutterBottom className={classes.subtitle}>
          Please sign the appropriate agreements to consent to us to start creating your deals on
          your behalf
        </Typography>
        <Paper
          className={`${iconsChecked.one ? classes.selected : ''} ${classes.item}`}
          onClick={() => signingModal(data)}
        >
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography className={classes.itemText}>Service Agreement</Typography>
          <img
            src={CheckCircle}
            className={classes.checkCircle}
            alt="checkbox"
            style={{ opacity: iconsChecked.one ? '1' : '' }}
          />
        </Paper>
        <Paper
          className={`${iconsChecked.two ? classes.selected : ''} ${classes.item}`}
          onClick={() =>
            setIconsChecked((prev) => {
              return { ...prev, two: true };
            })
          }
        >
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography className={classes.itemText}>Memorandum of Understanding</Typography>
          <img
            src={CheckCircle}
            className={classes.checkCircle}
            alt="checkbox"
            style={{ opacity: iconsChecked.two ? '1' : '' }}
          />
        </Paper>
        <Button
          onClick={() => {
            setPage(page + 1);
          }}
          className={classes.continueButton}
        >
          Continue
        </Button>
        <Typography
          className={classes.previousButton}
          onClick={() => {
            setPage(page - 1);
          }}
        >
          Previous
        </Typography>
      </Paper>
    </>
  );
}
