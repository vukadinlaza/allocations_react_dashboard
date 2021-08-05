import React, { useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
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

const DocumentsTab = ({ classes, data }) => {
  const [sortField, setSortField] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'document':
        return _.truncate(row[headerValue], { length: 25 });

      case 'status':
        if (row[headerValue] === 'wired' || row[headerValue] === 'signed') {
          return <Badge badgeContent="Complete" color="secondary" />;
        }
        return <Badge badgeContent="Incomplete" color="primary" />;

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
          documentsData.push({ ...investment, doc: titleCase(splitPath.slice(14)) });
        } else {
          documentsData.push({ ...investment, doc: titleCase(splitPath) });
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
