import React, { useState } from "react"
import { Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks';
import { Button, Table, TableBody, TableCell, TableRow, TableHead, Paper } from '@material-ui/core'
import Loader from '../../components/utils/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from "../../auth/useAuth"
import "./style.scss"

const GET_INVESTOR = gql`
  {
    investor {
      _id
      name
      admin
      organizations_admin {
        _id
        slug
        name
        logo
      }
    }
  }
`

export default function Funds () {
  const { data, error, user } = useAuth(GET_INVESTOR)

  if (!data) return <Loader />

  const { investor } = data

  return (
    <Col sm={{size: 8, offset: 2}}>
      <div className="Funds" style={{paddingBottom: "25px"}}>
        <div className="small-header text-left">Funds Admin &nbsp;&nbsp;{investor.admin && <Button variant="contained" size="small" color="secondary"><Link to="/admin/organizations/new">CREATE FUND MANAGER</Link></Button>}</div>
        <Paper className="funds-table" style={{margin: "15px"}}>
          <Table>
            <TableBody>
              {(investor.organizations_admin || []).map(org => (
                <TableRow key={org._id} className="admin-link">
                  <TableCell>
                    <OrgLogo org={org} />&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link to={`/admin/${org.slug}`}>
                      {org.name} Admin &nbsp;&nbsp;<FontAwesomeIcon icon="arrow-right" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </Col>
  )
}

function OrgLogo ({ org }) {
  const [err, setErr] = useState(null)

  if (err) {
    return <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" width="90" height="30" alt="" />
  }

  if (org.name === "Allocations") {
    return <img height="30px" width="90px" src={"https://www.allocations.co/assets/img/brand.svg"} />
  }

  return <img height="30px" onError={() => setErr(true)} width="90px" src={`https://allocations-public.s3.us-east-2.amazonaws.com/organizations/${org.slug}.png`} />
}