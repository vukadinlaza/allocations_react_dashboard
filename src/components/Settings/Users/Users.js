import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { withRouter } from "react-router";
import { useQuery } from '@apollo/react-hooks';
import AllocationsTable from '../../utils/AllocationsTable';
import Loader from '../../utils/Loader';


const ALL_USERS = gql`
  query AllUsers($filterField: String, $filterValue: String, $pagination: Int!, $currentPage: Int!, $sortField: String, $sortOrder: Int) {
    allUsers(filterField: $filterField, filterValue: $filterValue, pagination: $pagination, currentPage: $currentPage, sortField: $sortField, sortOrder: $sortOrder) {
      _id
      first_name
      last_name
      email
      entity_name
      investments{
        _id
      }
    }
  }
`;

const headers = [
  { value: 'first_name', label: 'First Name', isFilter: true },
  { value: 'last_name', label: 'Last Name', isFilter: true },
  { value: 'email', label: 'Email', isFilter: true },
  { value: 'entity_name', label: 'Entity', isFilter: true },
  { value: 'investments', label: 'Investments', type: 'count', align: 'center', alignHeader: true },
  { value: 'dashboard', label: 'Dashboard', keyNotInData: true, type: 'link', align: 'center', alignHeader: true },
]


const Users = ({
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
  history
}) => {
  if(!Object.keys(searchFilter).length) searchFilter = { field: "first_name" }
  const { data } = useQuery(ALL_USERS,
    {
      variables: {
        filterField: searchFilter.field,
        filterValue: searchFilter.searchFilter,
        pagination,
        currentPage,
        sortField,
        sortOrder
      }
    }
  );

  useEffect(() => setHeaders(headers), [])

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'count':
        return row[headerValue].length
      case 'link':
        return <a href={`/investor/${row._id}/home`}>Link</a>
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
        data={data.allUsers}
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

export default withRouter(Users);
