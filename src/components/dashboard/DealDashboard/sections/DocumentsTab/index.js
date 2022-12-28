import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { toast } from 'react-toastify';
import moment from 'moment';
import _ from 'lodash';
import {
  Badge,
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Grid,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Button } from '@allocations/design-system';
import { useFlags } from 'launchdarkly-react-client-sdk';
import AllocationsTable from '../../../../utils/AllocationsTable';
import Loader from '../../../../utils/Loader';
import { titleCase } from '../../../../../utils/helpers';

const SEND_REMINDER = gql`
  mutation SendInvestmentDocReminder($investment_id: String!) {
    sendInvestmentDocReminder(investment_id: $investment_id)
  }
`;

const headers = [
  {
    value: 'name',
    label: 'INVESTOR NAME',
    isFilter: true,
    isSortable: true,
    align: 'left',
    alignHeader: true,
  },
  {
    value: 'documents',
    label: 'DOCUMENT NAME',
    type: 'document',
    isFilter: true,
    isSortable: true,
    align: 'left',
    alignHeader: true,
  },
  {
    value: 'status',
    label: 'STATUS',
    type: 'status',
    isSortable: true,
    align: 'center',
  },
  {
    value: 'dateSigned',
    label: 'DATE SIGNED',
    isSortable: true,
    type: 'date',
    align: 'left',
    alignHeader: true,
  },
  {
    value: 'viewDoc',
    label: 'VIEW DOCUMENT',
    type: 'viewDoc',
    align: 'left',
    alignHeader: true,
    keyNotInData: true,
  },
];

const DocumentsTab = ({ classes, data, refetch }) => {
  const { downloadDocuments } = useFlags();
  const [sortField, setSortField] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  let documentsData = [];

  const [sendConfirmation] = useMutation(SEND_REMINDER, {
    onCompleted: () => {
      toast.success('Reminder sent successfully.');
      refetch();
    },
    onError: () => {
      toast.error('Sorry, something went wrong. Try again or contact support@allocations.com');
    },
  });

  const calculateReminder = (id) => {
    const { lastNotifiedDate, reqDate } = documentsData.find(({ investorId }) => investorId === id);

    let lastDate = '';

    if (lastNotifiedDate || reqDate) {
      lastDate = lastNotifiedDate || reqDate;
    }
    if (lastDate) {
      const convertedLastDate = new Date(Number(lastDate * 1000));

      const currentUnix = Date.now();
      const currentDate = new Date(currentUnix);

      const differenceUnixSeconds = currentDate - convertedLastDate;

      return differenceUnixSeconds;
    }
    return Infinity;
  };

  const handleSendReminder = (e) => {
    e.preventDefault();

    sendConfirmation({ variables: { investment_id: e.currentTarget.value } });
  };

  const getCellContent = (type, row, headerValue) => {
    const numOfSeconds = calculateReminder(row.investorId);
    let nextReminderDate = 0;
    if (numOfSeconds < 172800) {
      nextReminderDate = moment().add(numOfSeconds, 'seconds').calendar();
    }

    switch (type) {
      case 'document':
        return (
          <Tooltip title={row[headerValue]}>
            <Typography>{_.truncate(row[headerValue], { length: 25 })}</Typography>
          </Tooltip>
        );

      case 'status':
        if (!row.dateSigned) {
          return (
            <Badge
              badgeContent="Incomplete"
              color="primary"
              classes={{ colorPrimary: classes.badgeIncomplete }}
            />
          );
        }
        return (
          <Badge
            badgeContent="Complete"
            color="secondary"
            classes={{ colorSecondary: classes.badgeComplete }}
          />
        );

      case 'sideLetterStatus':
        if (row[headerValue] === 'pending') {
          return (
            <Badge
              badgeContent="Incomplete"
              color="primary"
              classes={{ colorPrimary: classes.badgeIncomplete }}
            />
          );
        }
        return (
          <Badge
            badgeContent="Complete"
            color="secondary"
            classes={{ colorSecondary: classes.badgeComplete }}
          />
        );

      case 'reminder':
        if (numOfSeconds < 172800) {
          return (
            <Tooltip title={`Next reminder may be sent ${nextReminderDate}`}>
              <PlayCircleFilledIcon
                color="disabled"
                fontSize="large"
                classes={{ colorDisabled: classes.playIconDisabled }}
              />
            </Tooltip>
          );
        }
        return (
          <IconButton onClick={(e) => handleSendReminder(e)} value={row.investorId}>
            <PlayCircleFilledIcon
              color="primary"
              fontSize="large"
              classes={{ colorPrimary: classes.playIcon }}
            />
          </IconButton>
        );
      case 'date':
        return moment(row[headerValue]).format('MM/DD/YYYY');
      case 'viewDoc':
        if (row.dateSigned) {
          return (
            <a
              href={row.docLink.includes('http') ? row.docLink : `//${row.docLink}`}
              target="_blank"
              rel="noopener noreferrer"
              key={row.docLink}
            >
              <PlayCircleFilledIcon
                color="primary"
                fontSize="large"
                classes={{ colorPrimary: classes.playIcon }}
              />
            </a>
          );
        }
        return (
          <PlayCircleFilledIcon
            color="disabled"
            fontSize="large"
            classes={{ colorDisabled: classes.playIconDisabled }}
          />
        );

      default:
        return <div />;
    }
  };

  const handleSort = (e) => {
    setSortField(e.target);
    setSearchTerm('');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // required me to store as variable. "No unused expressions"
  // eslint-disable-next-line no-unused-vars
  const unusedVariable = data?.deal?.investments?.forEach((investment) => {
    if (investment.documents.length) {
      investment.documents.forEach((doc) => {
        const splitPath = doc.path.split('/')[2] || doc.path;
        const containsId = splitPath.match(/\d{13}/);

        if (containsId) {
          documentsData.push({
            ...investment,
            doc: titleCase(splitPath.slice(14)),
            docLink: doc.link,
          });
        } else {
          documentsData.push({ ...investment, doc: titleCase(splitPath), docLink: doc.link });
        }
      });
    }
  });

  documentsData = documentsData.map((investment) => {
    return {
      investorId: investment.investor?._id,
      name: titleCase(investment.investor?.name),
      documents: investment.doc,
      docLink: investment.docLink,
      status: investment.status,
      dateSigned: moment(new Date(parseInt(investment._id.substring(0, 8), 16) * 1000)),
      sideLetterStatus: investment?.sideLetterData?.status,
      reqDate: investment?.sideLetterData?.requestedDate,
    };
  });

  if (!data) return <Loader />;

  if (searchTerm) {
    documentsData = documentsData.filter((doc) => {
      return doc[sortField]?.toUpperCase().includes(searchTerm.toUpperCase());
    });
  }

  const handleZip = async (dealName) => {
    console.log(documentsData, 'DOCS');
    try {
      const zip = new JSZip();

      if (documentsData.length === 0) {
        return toast.success('There are no documents to download.');
      }
      const files = await Promise.all(
        documentsData.map((doc) => {
          const link = doc.docLink.includes('https') ? doc.docLink : `https://${doc.docLink}`;
          return fetch(link).then((res) => {
            console.log(res, 'RES');
            return res.blob();
          });
        }),
      );
      console.log(files, 'FILES');
      files.forEach((file, i) =>
        zip.file(`${documentsData[i].documents.replace('.pdf', '')}.pdf`, file),
      );

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${dealName}_Investment_Documents.zip`);
    } catch {
      toast.error('Error downloading Investment Documents');
    }
  };

  return (
    <Grid className={classes.section}>
      {downloadDocuments && (
        <Grid
          item
          xs={12}
          style={{ marginBottom: '15px', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button text="Download Documents" onClick={() => handleZip(data.deal.company_name)} />
        </Grid>
      )}
      <div className={classes.searchContainer}>
        <FormControl variant="outlined" size="small" value={sortField}>
          <InputLabel htmlFor="field-filter">Field</InputLabel>
          <Select
            native
            label="Field"
            inputProps={{
              id: 'field-filter',
            }}
            onChange={handleSort}
          >
            <option value="name">Investor Name</option>
            <option value="documents">Document Name</option>
          </Select>
        </FormControl>
        <TextField
          label="Search"
          id="search-field"
          fullWidth
          onChange={handleSearch}
          value={searchTerm || ''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
              </InputAdornment>
            ),
          }}
          style={{ margin: '0 1em' }}
        />
      </div>
      <AllocationsTable data={documentsData} headers={headers} getCellContent={getCellContent} />
    </Grid>
  );
};

export default DocumentsTab;
