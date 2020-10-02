// import React, { useEffect, useState } from 'react'
// import Loader from '../utils/Loader'
// import { gql } from 'apollo-boost'
// import { pick } from 'lodash'
// import { useAuth } from "../../auth/useAuth";
// import { useMutation } from '@apollo/react-hooks';
// import { toast } from 'react-toastify';
// import {
//     Button,
//     Typography,
//     Grid
// } from '@material-ui/core'

// const GET_INVESTOR = gql`
//   query GetInvestor($email: String, $_id: String) {
//     investor(email: $email, _id: $_id) {
//       _id
//       first_name
//       last_name
//       entity_name
//       country
//       investor_type
//       signer_full_name
//       accredited_investor_status
//       email
//       accredidation_doc {
//         link
//         path
//       }
//       passport {
//         link
//         path
//       }
//     }
//   }
// `

// const ADD_DOC = gql`
//       mutation AddDealDoc($deal_id: String!, $title: String!, $doc: Upload!) {
//       addDealDoc(deal_id: $deal_id, title: $title, doc: $doc) {
//       _id
//     }
//     }
//     `



// // const DealDocuments = () => {
// //     const [investor, setInvestor] = useState(null);
// //     const [docs, setDocs] = useState()
// //     const [formStatus, setFormStatus] = useState("edit");
// //     const { userProfile, refetch } = useAuth(GET_INVESTOR);


// //     useEffect(() => {
// //         if (userProfile) {
// //             setInvestor(userProfile)
// //         }
// //     }, [userProfile])

// //     useEffect(() => {
// //         if (formStatus === "complete") refetch()
// //     }, [formStatus])

// //     const submit = () => {
// //         return updateDeal({
// //             variables: {
// //                 investor: pick(investor, ['_id', 'email', 'passport'])
// //             },
// //             onCompleted: toast.success('Success')
// //         })
// //     }

// //     if (!userProfile.email) return <div><Loader /></div>
// //     return (
// //         <>
// //             <Typography variant="h6">
// //                 Upload any Deal related Documents.
// //             </Typography>
// //             <div className="file-uploader">
// //                 <span className="file-label">Passport or ID*</span>
// //                 <Button variant="contained" component="label" size="small">
// //                     Upload
// //         <input type="file"
// //                         style={{ display: "none" }}
// //                         onChange={({ target }) => {
// //                             if (target.validity.valid) setDocs({ passport: target.files })
// //                         }} />
// //                 </Button>
// //             </div>            <Button variant="contained"
// //                 style={{ marginTop: 16 }}
// //                 onClick={submit}
// //                 color="primary">
// //                 Submit
// //             </Button>

// //         </>
// //     )
// // }

// function DealDocuments({ deal, refetch }) {
//     const [docs, setDocs] = useState()
//     const [addDoc, { data, error }] = useMutation(ADD_DOC)

//     useEffect(() => {
//         if (data) {
//             refetch()
//             setDoc({ title: "", doc: null })
//         }
//     }, [data])

//     const submit = () => {
//         if (doc.doc && doc.title) {
//             addDoc({ variables: { deal_id: deal._id, ...doc } })
//         }
//     }

//     return (
//         <>
//             <Grid item xs={12}>
//                 <Typography variant="body2">
//                     Wire Instructions
//           </Typography>
//             </Grid>

//             <Grid item xs={12} sm={3}>
//                 {!doc.doc && <Button fullWidth variant="contained" component="label" style={{ height: 39 }}>
//                     Attach
//             <input type="file"
//                         style={{ display: "none" }}
//                         accept="application/pdf"
//                         onChange={({ target }) => {
//                             if (target.validity.valid) setDoc({ doc: target.files[0] })
//                         }} />
//                 </Button>}
//             </Grid>


//             <Grid item xs={12} sm={4}>
//                 <Button variant="contained"
//                     onClick={submit}
//                     style={{ height: 39 }}
//                     fullWidth
//                     color="primary">
//                     Upload to Data Room
//           </Button>
//             </Grid>
//         </>
//     )
// }

// export default IdentityUpload