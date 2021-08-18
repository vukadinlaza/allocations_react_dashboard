import React, { useEffect, useState } from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AllocationsTable from '../../utils/AllocationsTable';
import MoreMenu from '../../utils/MoreMenu';
import { openInNewTab } from '../../../utils/helpers';

const headers = [
  {
    label: 'DOCUMENT NAME',
    value: 'documentName',
    type: 'documentName',
    isSortable: true,
  },
  {
    label: 'TYPE',
    value: 'type',
    isSortable: true,
    align: 'right',
    alignHeader: true,
  },
  {
    label: 'STATUS',
    value: 'status',
    type: 'status',
    isSortable: true,
    align: 'right',
    alignHeader: true,
    keyNotInData: true,
  },
  {
    label: 'ACTIONS',
    value: 'actions',
    type: 'actions',
    isSortable: false,
    keyNotInData: true,
  },
];

const getStatusColors = (status) => {
  switch (status) {
    case 'complete':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    default:
      return { backgroundColor: 'rgba(0,0,0,0)', color: 'red' };
  }
};

const UserDocuments = ({ classes, data }) => {
  const [userDocuments, setUserDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (data) {
      const userDocs = [];
      if (data.documents) {
        data.documents.forEach((doc) =>
          userDocs.push({
            ...doc,
            link: doc.docspringPermDownloadLink,
            type: doc.documentName.toUpperCase().includes('K-1') ? 'K-1' : 'KYC', // have link for all types of documents
            status: 'complete',
          }),
        );
      }
      if (data.investments) {
        let investmentsDocs = [];
        data.investments.forEach(
          (inv) => (investmentsDocs = [...investmentsDocs, ...inv.documents]),
        );
        investmentsDocs.forEach((doc) => {
          const docNameArray = doc.path.split('-');
          const docName = docNameArray[docNameArray.length - 1];
          userDocs.push({
            ...doc,
            documentName: docName, // have same key document Name for all docs
            type: 'Investment Agreement',
            status: 'complete',
          });
        });
      }
      setUserDocuments(userDocs);
    }
  }, [data]);

  const getDocName = (doc) => {
    return doc.documentName.split('.')[0].replaceAll('_', ' ');
  };

  const getCellContent = (type, row, headerValue) => {
    const actions = [
      {
        label: 'View Document',
        onItemClick: openInNewTab,
        clickArgs: { url: `${row.link.includes('http') ? row.link : `//${row.link}`}` },
      },
    ];
    switch (type) {
      case 'documentName':
        return getDocName(row);
      case 'status':
        return (
          <div
            className={classes.statusContainer}
            style={{
              color: getStatusColors(row.status).color,
              backgroundColor: getStatusColors(row.status).backgroundColor,
              marginLeft: 'auto',
            }}
          >
            {row[headerValue]}
          </div>
        );
      case 'date':
        // return moment(new Date(parseInt(row._id.substring(0, 8), 16) * 1000))
        // .format('MM/DD/YYYY');
        return 'Invalid Date';
      case 'actions':
        return <MoreMenu menuItems={actions} />;
      default:
        return <div />;
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const userDocumentsCopy = userDocuments
    .filter((doc) => doc.documentName.toUpperCase().includes(searchTerm.toUpperCase()))
    .map((doc) => {
      return {
        ...doc,
        documentName: getDocName(doc).trim(),
      };
    });

  return (
    <div className={classes.tableContainer}>
      <div className={classes.searchContainer}>
        <TextField
          label="Search"
          placeholder="Search by document name"
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
      <AllocationsTable
        data={userDocumentsCopy}
        headers={headers}
        getCellContent={getCellContent}
      />
    </div>
  );
};

export default UserDocuments;
