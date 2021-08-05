import React, { useState } from 'react';
import moment from 'moment';
import {
  Badge,
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  TextField,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AllocationsTable from '../../../utils/AllocationsTable';
import Loader from '../../../utils/Loader';
import { titleCase } from '../../../../utils/helpers';
import '../style.scss';

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
  { value: 'reminder', label: 'SEND REMINDER', align: 'left', alignHeader: true },
  { value: 'viewDoc', label: 'VIEW DOCUMENT', align: 'left', alignHeader: true },
];

// on INDEX, if there is no, investor.documents, don't render this tab?

const DocumentsTab = ({ classes, data }) => {
  // console.log('Deal', data);
  const [sortField, setSortField] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'document':
        if (row[headerValue].length > 1) {
          // if it's more than one document, what should be done?
          return row[headerValue].map((doc) => {
            return doc.split('/')[2];
          });
        }
        if (row[headerValue].length === 1) {
          return row[headerValue][0].split('/')[2];
        }
        return row[headerValue];
      case 'status':
        if (row[headerValue] === 'completed' || 'wired') {
          return <Badge badgeContent="Complete" color="secondary" />;
        }
        return <Badge badgeContent="Incomplete" color="primary" />;

      default:
        return <div />;
    }
  };

  const sortBy = (documentsData) => {
    return documentsData.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return -1;
      }
      if (a[sortField] > b[sortField]) {
        return 1;
      }
      return 0;
    });
  };

  // console.log(sortBy(documentsData));

  const handleSort = (e) => {
    // console.log('value', e.target.value);
    setSortField(e.target.value);
  };

  const handleSearch = (e) => {
    console.log('Search Term', e.target.value);
    setSearchTerm(e.target.value);
  };

  let documentsData = data?.deal?.investments?.map((investment) => {
    return {
      investorId: investment.investor?._id,
      name: titleCase(investment.investor?.name),
      documents: investment.documents?.map((doc) => {
        return doc.path;
      }),
      status: investment.status,
      dateSigned: moment(new Date(parseInt(investment._id.substring(0, 8), 16) * 1000)).format(
        'MM/DD/YYYY',
      ),
    };
  });
  // console.log('Docs', documentsData);

  if (!data) return <Loader />;

  if (searchTerm) {
    documentsData = documentsData.filter((doc) =>
      doc[sortField]?.toUpperCase().includes(searchTerm.toUpperCase()),
    );
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
