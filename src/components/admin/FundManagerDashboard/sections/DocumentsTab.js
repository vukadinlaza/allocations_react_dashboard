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
    value: 'status',
    label: 'STATUS',
    type: 'status',
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
  const [sortField, setSortField] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  const [sendConfirmation] = useMutation(SEND_REMINDER, {
    onCompleted: () => {
      toast.success('Reminder sent successfully.');
    },
    onError: () => {
      toast.error('Sorry, something went wrong. Try again or contact support@allocations.com');
    },
  });
  // console.log(data.deal?.investments);
  const handleSendReminder = async () => {
    const investmentId = '603a2c6f45e3980023d21410';

    sendConfirmation({ variables: { investment_id: investmentId } });
    console.log('Clicked');
  };

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'document':
        return (
          <HtmlTooltip title={row[headerValue]}>
            <Typography>{_.truncate(row[headerValue], { length: 25 })}</Typography>
          </HtmlTooltip>
        );

      case 'status':
        // status' include: wired, complete, signed, invited (legacy), and pending (legacy).
        if (!row[headerValue]) {
          return <Badge badgeContent="Incomplete" color="primary" />;
        }
        return <Badge badgeContent="Complete" color="secondary" />;

      case 'reminder':
        // if (!row.dateSigned) {
        return (
          <PlayCircleFilledIcon color="primary" fontSize="large" onClick={handleSendReminder} />
        );
      // }
      // return <PlayCircleFilledIcon color="disabled" fontSize="large" />;

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
    setSortField(e.target.value);
    setSearchTerm('');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  let documentsData = [];

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
    };
  });

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
