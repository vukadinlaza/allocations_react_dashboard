import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
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
  withStyles,
  IconButton,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import AllocationsTable from '../../../utils/AllocationsTable';
import Loader from '../../../utils/Loader';
import { titleCase } from '../../../../utils/helpers';
import '../style.scss';

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 400,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

// should this happen in the parent?
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
    value: 'sideLetterStatus',
    label: 'STATUS',
    type: 'sideLetterStatus',
    isSortable: true,
    align: 'center',
  },
  { value: 'dateSigned', label: 'DATE SIGNED', isSortable: true, align: 'left', alignHeader: true },
  {
    value: 'reminder',
    label: 'SEND REMINDER',
    type: 'reminder',
    align: 'left',
    alignHeader: true,
    keyNotInData: true,
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

const DocumentsTab = ({ classes, data }) => {
  // const [dealData, setDealData] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  let documentsData = [];

  const [sendConfirmation] = useMutation(SEND_REMINDER, {
    onCompleted: () => {
      toast.success('Reminder sent successfully.');
    },
    onError: () => {
      toast.error('Sorry, something went wrong. Try again or contact support@allocations.com');
    },
  });

  const calculateReminder = (id) => {
    // console.log({ id });
    const { lastNotifiedDate, reqDate } = documentsData.find(({ investorId }) => investorId === id);

    let lastDate = '';

    if (lastNotifiedDate || reqDate) {
      lastDate = lastNotifiedDate || reqDate;
    }

    const convertedLastDate = new Date(Number(lastDate * 1000));

    const currentUnix = Date.now();
    const currentDate = new Date(currentUnix);

    const differenceUnix = currentDate - convertedLastDate;
    const differenceInDays = Math.trunc(differenceUnix / (1000 * 3600 * 24));
    // does this need to be more precise -- hours?

    return differenceInDays;
  };

  const handleSendReminder = (e) => {
    e.preventDefault();

    // WHAT IS THE INVESTMENT id
    const investmentId = '603a2c6f45e3980023d21410';

    // if less than two days, tool tip to say when you can send next reminder
    // if more than two days, sendConfirmation() to back end.
    // toast.success
    // button should then gray out.

    sendConfirmation({ variables: { investment_id: investmentId } });
  };

  const getCellContent = (type, row, headerValue) => {
    const numOfDays = calculateReminder(row.investorId);
    // console.log('days', numOfDays);
    switch (type) {
      case 'document':
        return (
          <HtmlTooltip title={row[headerValue]}>
            <Typography>{_.truncate(row[headerValue], { length: 25 })}</Typography>
          </HtmlTooltip>
        );

      case 'sideLetterStatus':
        if (row[headerValue] === 'pending') {
          // if (!row[headerValue]) {
          return <Badge badgeContent="Incomplete" color="primary" />;
        }
        return <Badge badgeContent="Complete" color="secondary" />;

      case 'reminder':
        if (numOfDays > 2) {
          return (
            <IconButton onClick={(e) => handleSendReminder(e)} value={row.investorId}>
              <PlayCircleFilledIcon color="primary" fontSize="large" />
            </IconButton>
          );
        }
        return (
          <HtmlTooltip title="A reminder has been sent in the past two days.">
            <PlayCircleFilledIcon color="disabled" fontSize="large" />;
          </HtmlTooltip>
        );

      case 'viewDoc':
        if (row.dateSigned) {
          return (
            <a
              href={`//${row.docLink}`}
              target="_blank"
              rel="noopener noreferrer"
              key={row.docLink}
            >
              <PlayCircleFilledIcon color="primary" fontSize="large" />
            </a>
          );
        }
        return <PlayCircleFilledIcon color="disabled" fontSize="large" />;

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
  const hello = data?.deal?.investments?.forEach((investment) => {
    if (investment.documents.length >= 1) {
      investment.documents.forEach((doc) => {
        const splitPath = doc.path.split('/')[2];
        const containsId = splitPath.match(/\d{13}/);

        if (containsId !== null) {
          documentsData.push({
            ...investment,
            doc: titleCase(splitPath.slice(14)),
            docLink: doc.link,
          });
        } else {
          documentsData.push({ ...investment, doc: titleCase(splitPath), docLink: doc.link });
        }
      });
    } else {
      documentsData.push(investment);
    }
  });

  documentsData.push({
    _id: '60be50d7d2e781002309e606',
    investor: {
      _id: '60be50d7d2e781002309e606',
      name: 'Test',
    },
    doc: 'hello',
    docLink: 'hello2',
    status: 'completed',
    sideLetterData: {
      status: 'pending',
      requestedDate: 1618537161,
    },
  });

  // console.log(documentsData);

  documentsData = documentsData.map((investment) => {
    return {
      investorId: investment.investor?._id,
      name: titleCase(investment.investor?.name),
      documents: investment.doc,
      docLink: investment.docLink,
      status: investment.status,
      dateSigned: moment(new Date(parseInt(investment._id.substring(0, 8), 16) * 1000)).format(
        'MM/DD/YYYY',
      ),
      sideLetterStatus: investment?.sideLetterData?.status,
      reqDate: investment?.sideLetterData?.requestedDate,
    };
  });
  // console.log(documentsData);
  if (!data) return <Loader />;

  if (searchTerm) {
    documentsData = documentsData.filter((doc) => {
      return doc[sortField]?.toUpperCase().includes(searchTerm.toUpperCase());
    });
  }

  return (
    <div className={classes.section}>
      <div className={classes.searchContainer}>
        <FormControl
          variant="outlined"
          // style={{ width: `${selectWidth}em`}}
          size="small"
          value={sortField}
        >
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
    </div>
  );
};

export default DocumentsTab;
