import React from 'react';
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
  { value: 'name', label: 'INVESTOR NAME', isFilter: true, align: 'left', alignHeader: true },
  {
    value: 'documents',
    label: 'DOCUMENT NAME',
    type: 'document',
    isFilter: true,
    // isSortable: true,
    align: 'left',
    alignHeader: true,
  },
  {
    value: 'status',
    label: 'STATUS',
    type: 'status',
    // isSortable: true,
    align: 'center',
    // alignHeader: true,
  },
  { value: 'dateSigned', label: 'DATE SIGNED', align: 'left', alignHeader: true },
  { value: 'reminder', label: 'SEND REMINDER', align: 'left', alignHeader: true },
  { value: 'viewDoc', label: 'VIEW DOCUMENT', align: 'left', alignHeader: true },
];

// on INDEX, if there is no, investor.documents, don't render this tab?

const DocumentsTab = ({ classes, data }) => {
  // console.log('Deal', data);

  const getCellContent = (type, row, headerValue) => {
    // console.log('ROW', row, headerValue);
    switch (type) {
      case 'document':
        // duplicate file names, but different investment ids?
        return row[headerValue];
      // return row[headerValue].documents[0].split('/')[2];
      case 'status':
        if (row[headerValue] === 'completed') {
          return <Badge badgeContent="Complete" color="secondary" />;
        }
        return <Badge badgeContent="Incomplete" color="primary" />;

      default:
        return <div />;
    }
  };

  const documentsData = data?.deal?.investments?.map((investment) => {
    return {
      investorId: investment.investor?._id,
      name: investment.investor?.name,
      documents: investment.documents?.map((doc) => {
        return doc.path;
      }),
      status: investment.status,
      // date is not right
      // dateSigned: investment.investor?.documents,
    };
  });
  // console.log('Docs', documentsData);

  if (!data) return <Loader />;

  return (
    <div className={classes.section}>
      <div className={classes.searchContainer}>
        <FormControl
          variant="outlined"
          // style={{ width: `${selectWidth}em`}}
          size="small"
        >
          <InputLabel htmlFor="field-filter">Field</InputLabel>
          <Select
            native
            label="Field"
            inputProps={{
              id: 'field-filter',
            }}
          >
            {headers
              .filter((header) => header.isFilter)
              .map((header, index) => (
                <option value={header.value} key={`header-${index}`}>
                  {titleCase(header.label)}
                </option>
              ))}
          </Select>
        </FormControl>
        <TextField
          label="Search"
          placeholder="Search by investor name"
          id="search-field"
          fullWidth
          // onChange={handleSearch}
          // value={searchTerm || ''}
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
// export default withStyles(styles)(DocumentsTab);
