import React, { useEffect, useState } from 'react';
import { Button, Input, List, Typography } from '@allocations/design-system';
import { titleCase, sortByString, openInNewTab } from '@allocations/nextjs-common';
import 'chartjs-plugin-datalabels';
import { Grid } from '@material-ui/core';

const dealInvestmentsHeaders = [
  {
    id: 'documentName',
    label: 'Document Name',
    withSort: true,
    customSort: true,
  },
  {
    id: 'dealName',
    label: 'Deal Name',
    withSort: true,
    customSort: true,
  },
  {
    id: 'type',
    label: 'Type',
    withSort: true,
    customSort: true,
  },
  {
    id: 'view',
    label: '',
    isButton: true,
  },
];

const UserDocuments = ({ classes, userInvestments, setShowDocuments }) => {
  const [search, setSearch] = useState('');
  const [userDocuments, setUserDocuments] = useState([]);

  useEffect(() => {
    document.querySelector('.mainRoute').scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const userDocs = [];
    if (userInvestments) {
      userInvestments.forEach((inv) => {
        inv.metadata.documents.forEach((doc) => {
          const docNameArray = doc.path.split('/');
          const docName = docNameArray[docNameArray.length - 1];
          userDocs.push({
            ...doc,
            documentName: docName, // have same key document Name for all docs
            type: /K1|K-1/.test(doc.path.toUpperCase())
              ? 'K-1'
              : /AGREEMENT|SUBSCRIPTION|DOCS/.test(doc.path.toUpperCase())
              ? 'Investment Agreement'
              : 'N/A',
            status: 'Complete',
            dealName: inv.dealName,
          });
        });
      });
      setUserDocuments(userDocs);
    }
  }, [userInvestments]);

  const getFormattedData = () =>
    userDocuments.length
      ? userDocuments.map((document) => {
          const { documentName, type, dealName } = document;
          return {
            documentName: titleCase(documentName || ''),
            dealName: titleCase(dealName || ''),
            type,
            view: (
              <Button
                text="View"
                variant="primary"
                onClick={() =>
                  openInNewTab(
                    document.link
                      ? `${document.link.includes('http') ? document.link : `//${document.link}`}`
                      : '',
                  )
                }
                size="small"
              />
            ),
          };
        })
      : [{}];

  const handleSort = (data, orderBy, direction) => {
    switch (orderBy) {
      case 'documentName':
      case 'dealName':
      case 'type':
        return data.sort((a, b) => sortByString(a[orderBy], b[orderBy], '', direction));
      default:
        return data;
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
  };

  const filteredData = getFormattedData().filter((document) =>
    `${document.dealName} ${document.documentName} ${document.type}`
      .toLowerCase()
      .includes(search?.toLowerCase()),
  );

  return (
    <Grid container spacing={2} className={classes.listsContainer}>
      <Grid item xs={1} />
      <Grid item xs={10} className={classes.list}>
        <div className={classes.back}>
          <span className={classes.previousPage}>
            <Typography
              component="div"
              content="Dashboard"
              fontColor="#94A3B8"
              fontWeight={500}
              variant="button"
              onClick={() => setShowDocuments(false)}
            />
          </span>
          <div className={classes.breadcrumbSeparator}>
            <Typography
              component="div"
              content="/"
              fontColor="#94A3B8"
              fontWeight={500}
              variant="button"
            />
          </div>
          <Typography
            component="div"
            content="Documents"
            fontColor="#2A2B54"
            fontWeight={500}
            variant="button"
          />
        </div>
        <div className={classes.searchContainer}>
          <Input
            helperText=""
            iconName="search"
            iconPosition="left"
            label=""
            name="search"
            placeholder="Search Documents"
            type="text"
            onChange={handleSearch}
          />
        </div>
        <List
          data={filteredData}
          headers={dealInvestmentsHeaders}
          sortBy="Investment"
          sortDirection="asc"
          customSort={handleSort}
        />
      </Grid>
      <Grid item xs={false} md={1} />
    </Grid>
  );
};

export default UserDocuments;
