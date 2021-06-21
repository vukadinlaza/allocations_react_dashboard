import React, { useEffect } from 'react';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import { nWithCommas } from '../../../../utils/numbers';
import { phone } from '../../../../utils/helpers';
import { useAuth } from '../../../../auth/useAuth';
import AllocationsTable from '../../../utils/AllocationsTable'
import Loader from '../../../utils/Loader'


const GET_INVESTMENTS = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      investments {
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
  }
`;

const Investments = ({ classes, width }) => {

  const { organization } = useParams();
  const [getInvestments, { data, error }] = useLazyQuery(GET_INVESTMENTS);

  useEffect(() => {
    getInvestments({ variables: { slug: organization } });
  }, []);

  const headers = [
    { value: 'company_name', label: 'NAME', align: 'left', alignHeader: true },
    { value: 'date', label: 'DATE', type: 'date', align: 'left', alignHeader: true },
    { value: 'amount', label: 'INVESTMENT', type: 'amount', align: 'right', alignHeader: true },
  ]
  // add or remove tagline column depending on viewport width
  if(width > phone) headers.splice(1, 0, { value: 'company_description', label: 'TAGLINE', align: 'left', alignHeader: true })
  if(headers.map(h => h.value).includes('company_description') && (width < phone)) headers.splice(1, 1)


  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'date':
        return moment(row[headerValue]).format('MM/DD/YYYY')
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`
      default:
        return <div></div>
    }
  }


  if(!data?.organization?.investments){
    return <Loader/>
  }

  const { investments } = data.organization;
  const investmentsData = investments.map(inv => {
    return {
      company_name: inv.deal.company_name,
      company_description: inv.deal.company_description,
      amount: inv.amount,
      date: inv.created_at
    }
  })

  return (
    <div className={classes.section}>
      <AllocationsTable
        data={investmentsData}
        headers={headers}
        getCellContent={getCellContent}
        />
    </div>
  );
}

export default Investments;
