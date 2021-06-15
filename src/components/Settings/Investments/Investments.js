import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { withRouter } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import AllocationsTable from '../../utils/AllocationsTable';
import Loader from '../../utils/Loader';
import { nWithCommas } from '../../../utils/numbers'


const ALL_INVESTMENTS = gql`
  query InvestmentsList($filterField: String, $filterValue: String, $pagination: Int!, $currentPage: Int!, $sortField: String, $sortOrder: Int, $nestedKey: String, $nestedCollection: String, $localFieldKey: String) {
    investmentsList(filterField: $filterField, filterValue: $filterValue, pagination: $pagination, currentPage: $currentPage, sortField: $sortField, sortOrder: $sortOrder, nestedKey:$nestedKey, nestedCollection: $nestedCollection, localFieldKey: $localFieldKey) {
      _id
      amount
      deal {
        _id
        company_name
      }
      status
      investor {
        _id
        email
      }
    }
  }
`;

const headers = [
  { value: 'investor', label: 'Investor', isFilter: true, type: 'investor', nestedKey: 'email', nestedCollection: 'users', localFieldKey: 'user_id' },
  { value: 'deal', label: 'Deal', isFilter: true, type: 'deal', nestedKey: 'company_name', nestedCollection: 'deals', localFieldKey: 'deal_id' },
  { value: 'status', label: 'Status', isFilter: true },
  { value: 'amount', label: 'Amount', type: 'amount' },
]


const Investments = ({
  classes,
  setHeaders,
  searchFilter,
  pagination,
  currentPage,
  sortField,
  sortOrder,
  onChangePage,
  onChangeRowsPerPage,
  onChangeSort,
  nestedKey,
  nestedCollection,
  localFieldKey,
  history
}) => {
  if(!Object.keys(searchFilter).length) searchFilter = { field: "status" }
  const { data } = useQuery(ALL_INVESTMENTS,
    {
      variables: {
        filterField: searchFilter.field,
        filterValue: searchFilter.searchFilter,
        pagination,
        currentPage,
        sortField,
        sortOrder,
        nestedKey,
        nestedCollection,
        localFieldKey
      }
    }
  );

  useEffect(() => setHeaders(headers), [])

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'investor':
        return (row[headerValue]? row[headerValue].email : 'No email found')
      case 'deal':
        return (row[headerValue]? row[headerValue].company_name : 'No company found')
      case 'amount':
        return nWithCommas(row[headerValue])
      default:
        <div></div>
    }
  }

  const handleRowDetailPage = (row) => {
    history.push(`/admin/users/${row._id}`)
  }

  if (!data) return <Loader />;

  return (
    <div className={classes.root}>
      <AllocationsTable
        data={data.investmentsList}
        headers={headers}
        serverPagination={true}
        rowsQuantity={pagination}
        currentPage={currentPage}
        includeCheckbox={true}
        rowSelector="_id"
        rowDetailPage={true}
        handleRowDetailPage={handleRowDetailPage}
        getCellContent={getCellContent}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        getSortProps={onChangeSort}
        />
    </div>
  );
}

export default withRouter(Investments);
