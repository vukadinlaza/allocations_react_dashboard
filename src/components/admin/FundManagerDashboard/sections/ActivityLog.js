import React from 'react';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import { SimpleBox, ChartBox } from '../widgets';
import { nWithCommas } from '../../../../utils/numbers'
import AllocationsTable from '../../../utils/AllocationsTable'

const headers = [
  {label: 'DATE', value: 'date', type: 'date'},
  {label: 'TYPE', value: 'type', type: 'type'},
  {label: 'AMOUNT', value: 'amount', type: 'amount'},
  {label: 'DETAIL', value: 'detail'},
  {label: 'BALANCE', value: 'balance', type: 'amount'},
]

const data = [
  {date: new Date(), type: 'wire', amount: 25000, detail: 'Wire from Joshua Browder', balance: 75000},
  {date: new Date(), type: 'expense', amount: 25000, detail: 'Fee from Allocations', balance: 50000},
  {date: new Date(), type: 'investment', amount: 20000, detail: 'Investment to NBA Top Shot', balance: 30000},
  {date: new Date(), type: 'wire', amount: 10000, detail: 'Wire from Kingsley Advani', balance: 50000},
]


const ActivityLog = ({ classes }) => {

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'type':
        const typeColors = {
          wire: '58, 198, 35',
          expense: '255, 4, 4',
          investment: '4, 97, 255'
        }
        return (
          <div className={classes.logType} style={{background: `rgba(${typeColors[row[headerValue]]}, 0.2)`, color: `rgba(${typeColors[row[headerValue]]}, 1)`, fontWeight: "bold"}}>
            {`${row[headerValue].charAt(0).toUpperCase()}${row[headerValue].slice(1)}`}
          </div>
        )
      case 'date':
        return moment(row[headerValue]).format('MM/DD/YYYY')
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`
      default:
        return <div></div>
    }
  }

  return (
    <div className={classes.section}>
      <AllocationsTable
        data={data}
        headers={headers}
        getCellContent={getCellContent}
        />
    </div>
  );
}

export default ActivityLog;
