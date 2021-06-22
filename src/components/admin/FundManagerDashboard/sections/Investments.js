import React, { useEffect } from 'react';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import { nWithCommas } from '../../../../utils/numbers';
import { phone } from '../../../../utils/helpers';
import { useAuth } from '../../../../auth/useAuth';
import ServerTable from '../../../utils/ServerTable'
import Loader from '../../../utils/Loader'


const tableVariables = {
  gqlQuery: `
    query GetOrg($slug: String!, $pagination: PaginationInput!) {
      pagOrganization(slug: $slug, pagination: $pagination) {
        _id
        pagInvestments {
          _id
          amount
          created_at
          deal {
            _id
            company_name
            company_description
            date_closed
          }
          investor {
            _id
          }
        }
      }
    }`,
  headers: [
    {
      value: 'deal',
      label: 'NAME',
      align: 'left',
      alignHeader: true,
      isFilter: true,
      nestedKey: 'company_name',
      nestedCollection: 'deals',
      localFieldKey: 'deal_id',
      type: 'company',
      keyNotInData: true
    },{
      value: 'date',
      label: 'DATE',
      type: 'date',
      align: 'left',
      alignHeader: true,
      keyNotInData: true
    },{
      value: 'amount',
      label: 'INVESTMENT',
      type: 'amount',
      align: 'right',
      alignHeader: true
    },
  ],
  dataVariable: 'pagOrganization.pagInvestments',
  defaultSortField: "company_name"
}

const Investments = ({ classes, width }) => {

  const { organization } = useParams();

  // add or remove tagline column depending on viewport width
  const taglineInHeaders = tableVariables.headers.map(h => h.value).includes('company_description')
  if(width > phone && !taglineInHeaders) tableVariables.headers.splice(1, 0, { value: 'company_description', label: 'TAGLINE', align: 'left', alignHeader: true , type: 'tagline', keyNotInData: true})
  if(taglineInHeaders && (width < phone)) tableVariables.headers.splice(1, 1)


  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'company':
        return row.deal.company_name
      case 'tagline':
        return row.deal.company_description
      case 'date':
        return moment(row[headerValue]).format('MM/DD/YYYY')
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`
      default:
        return <div></div>
    }
  }


  if(!tableVariables){
    return <Loader/>
  }

  return (
    <div className={classes.section}>
      <ServerTable
        tableVariables={tableVariables}
        getCellContent={getCellContent}
        queryVariables={{ slug: organization }}
        tablePagination={5}
        />
    </div>
  );
}

export default Investments;
