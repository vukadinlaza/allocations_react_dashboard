import React, {useState} from "react"
import {Row, Col} from 'reactstrap'
import {Link} from 'react-router-dom'
import {gql} from 'apollo-boost'
import {useQuery} from '@apollo/react-hooks';
import {Button, Table, TableBody, TableCell, TableRow, TableHead, Paper} from '@material-ui/core'
import Loader from '../../components/utils/Loader'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useAuth} from "../../auth/useAuth"
import "./style.scss"
import {useHistory} from "react-router-dom"

/***
 *
 * Table view of Funds that a user is an admin on
 *
 **/


export default function Funds() {
  const {userProfile} = useAuth()
  const history = useHistory()

  if (!userProfile.email) return <div><Loader/></div>

  return (
    <>
      <div className="small-header text-left">Funds Admin &nbsp;&nbsp;{userProfile.admin &&
      <Button onClick={() => history.push("/admin/organizations/new")} size="small"
              color="secondary">
        CREATE FUND MANAGER
      </Button>}</div>

      <Paper className="funds-table" style={{margin: "15px"}}>
        <Table>
          <TableBody>
            {(userProfile.organizations_admin || []).map(org => (
              <TableRow key={org._id} className="admin-link">
                <TableCell>
                  <OrgLogo org={org}/>&nbsp;&nbsp;&nbsp;&nbsp;
                  {org.name} Admin
                </TableCell>
                <TableCell>
                  <Button onClick={() => history.push(`/admin/${org.slug}`)} variant="contained" size="small"
                          color="primary">
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  )
}

function OrgLogo({org}) {
  const [err, setErr] = useState(null)

  if (err) {
    return <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" width="90" height="30" alt=""/>
  }

  if (org.name === "Allocations") {
    return (
      <img
        height="30px"
        width="90px"
        src={"https://allocations-public.s3.us-east-2.amazonaws.com/logo.png"}
        alt="Allocations"
      />
    )
  }

  return (
    <img
      height="30px"
      width="90px"
      onError={() => setErr(true)}
      src={`https://allocations-public.s3.us-east-2.amazonaws.com/organizations/${org.slug}.png`}
      alt={`${org.slug}`}
    />
  )
}
