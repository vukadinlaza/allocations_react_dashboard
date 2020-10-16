import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Hidden,
  Paper,
  ListItem,
  List,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Grid,
  Button,
  Fab,
  Typography,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import BarChartIcon from "@material-ui/icons/BarChart";
import PersonIcon from "@material-ui/icons/Person";
import StorefrontIcon from '@material-ui/icons/Storefront';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import "./style.scss";

/***
 *
 * Marketplace
 *
 **/

export default function Marketplace() {
  const deals = [
    {
      to:"/axiom-space",
      name:"Axiom Space",
      logo:"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/bb72289d-95de-4204-8362-1fa11a36f34e/axiom_space.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201016T172044Z&X-Amz-Expires=86400&X-Amz-Signature=6f7a7664d51741d39aec32898229b04aaaeb0edb2ad625412dd56821da6b6ddb&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22axiom_space.png%22",
      sharePrice:"50",
      round:"Series A",
      lastRoundDate:"10/10/2019",
      valuation:"$1.05M",
      allocation:"10,000,000",
      percentDifference:"3.55",
      fees:"0",
      closeDate:"11/10/2020",
      },
      {
      to:"/brex",
      name:"Brex",
      logo:"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/339daf56-c62f-410e-9cba-a3ed3e5478fa/brex.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201016T171956Z&X-Amz-Expires=86400&X-Amz-Signature=8631715f0744f254f9377785c409586a0bc1c192d68a9f9a719408cbf83bc0c5&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22brex.png%22",
      sharePrice:"30",
      round:"Series A",
      lastRoundDate:"5/12/2020",
      valuation:"$3.50M",
      allocation:"10,000",
      percentDifference:"4.65",
      fees:"0",
      closeDate:"11/11/2020",
      },
      {
      to:"/juvenescence",
      name:"Juvenescence",
      logo:"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/dfdc2bf0-2014-40d3-85dc-4f6708e6446e/juvenescence.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201016T172159Z&X-Amz-Expires=86400&X-Amz-Signature=398c687f831c47c790447b7443acc17aa28993d6aca20d93ed32463a89a54d14&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22juvenescence.png%22",
      sharePrice:"55",
      round:"Series D",
      lastRoundDate:"3/12/2020",
      valuation:"3.05B",
      allocation:"25,000",
      percentDifference:"13.05",
      fees:"0",
      closeDate:"12/31/2020",
      },
      {
      to:"/allocations",
      name:"Allocations",
      logo:"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/be054227-50aa-416a-9a51-6b0ac78ce12b/allocations.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201016T172321Z&X-Amz-Expires=86400&X-Amz-Signature=40f8efce71fe534be190ba668057220cdba98c7b8775c57e1cbcb81cece82ff4&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22allocations.png%22",
      sharePrice:"25",
      round:"Series B",
      lastRoundDate:"7/12/2020",
      valuation:"1.5M",
      allocation:"5,000",
      percentDifference:"3.05",
      fees:"0",
      closeDate:"10/31/2020",
      },
      {
      to:"/abra",
      name:"Abra",
      logo:"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b0d84395-a1f1-4d7f-99cb-02868296089b/abra.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201016T172435Z&X-Amz-Expires=86400&X-Amz-Signature=9d8ca672848bce19342b06917db535648dafcb849d122702c7de8e915dfeb2b1&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22abra.png%22",
      sharePrice:"45",
      round:"Series B",
      lastRoundDate:"7/12/2020",
      valuation:"1.5M",
      allocation:"5,000",
      percentDifference:"3.05",
      fees:"0",
      closeDate:"10/31/2020",
      },
      {
      to:"/assure",
      name:"Assure",
      logo:"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/3176ee2f-441c-468f-bf4e-b295474dd578/assure.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201016T172608Z&X-Amz-Expires=86400&X-Amz-Signature=dc16df0a662644cc29c1c6955b559a86f32c0a4fcd6681edf1fad62303f14129&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22assure.png%22",
      sharePrice:"105",
      round:"Series B",
      lastRoundDate:"7/12/2020",
      valuation:"1.05M",
      allocation:"5,000",
      percentDifference:"3.05",
      fees:"0",
      closeDate:"10/31/2020",
      },
      {
      to:"/airbnb",
      name:"Airbnb",
      logo:"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e69381ca-0e85-4f2a-b470-942d72d3689a/air_bnb.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201016T172807Z&X-Amz-Expires=86400&X-Amz-Signature=8650db2e78f80bc33b78b951f6ed1c2104b1aa5fad8a2df83f2a0f927a62893c&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22air_bnb.png%22",
      sharePrice:"250",
      round:"Series B",
      lastRoundDate:"7/12/2020",
      valuation:"1.05M",
      allocation:"5,000",
      percentDifference:"3.05",
      fees:"0",
      closeDate:"10/31/2020",
      },
      {
      to:"/bakkt",
      name:"Bakkt",
      logo:"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/7a5fa559-68ca-479b-9734-95b93cd4a8d7/bakkt.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201016T172841Z&X-Amz-Expires=86400&X-Amz-Signature=eae0980245e5e9d754d0670ad2e1c2c8739092c24ee4425bcd2b47780ef8a86d&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22bakkt.png%22",
      sharePrice:"15",
      round:"Series B",
      lastRoundDate:"7/12/2020",
      valuation:"2.35M",
      allocation:"5,000",
      percentDifference:"3.05",
      fees:"0",
      closeDate:"10/31/2020",
      },
      {
      to:"/wavebase",
      name:"Wavebase",
      logo:"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/470d489e-b2fa-4746-a793-5c3ea0356347/wavebase.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201016T172937Z&X-Amz-Expires=86400&X-Amz-Signature=4d3d5bb4f63be93be445a1bc0c6273bdf69aa96968ed530dd5fb97a9b9336274&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22wavebase.png%22",
      sharePrice:"100",
      round:"Series B",
      lastRoundDate:"7/12/2020",
      valuation:"2.35M",
      allocation:"5,000",
      percentDifference:"3.05",
      fees:"0",
      closeDate:"10/31/2020",
      },
      {
      to:"/vectr",
      name:"Vectr",
      logo:"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/253bb1be-fcab-436c-bbd3-d168de3a31dc/vectr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201016T173010Z&X-Amz-Expires=86400&X-Amz-Signature=01a0e64b48c313f68404572219f483e595d33518729a52871695eea91480077e&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22vectr.png%22",
      sharePrice:"140",
      round:"Series B",
      lastRoundDate:"7/12/2020",
      valuation:"1.05M",
      allocation:"5,000",
      percentDifference:"3.05",
      fees:"0",
      closeDate:"10/31/2020",
      },
      {
      to:"/spacex",
      name:"SpaceX",
      logo:"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/138d8db8-5fd0-431d-a46b-dd463bc6355e/spacex.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201016T173049Z&X-Amz-Expires=86400&X-Amz-Signature=42f6a68d302bf05339b93b963439bb4c160d88715ac13ef7cf0ce6520f4b5be1&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22spacex.png%22",
      sharePrice:"234",
      round:"Series D",
      lastRoundDate:"7/12/2020",
      valuation:"2.15B",
      allocation:"15,000",
      percentDifference:"13.05",
      fees:"0",
      closeDate:"11/12/2020",
      },
      {
      to:"/pioneer-fund",
      name:"Pioneer Fund",
      logo:"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2b6ce8b9-6382-4e4c-b8a9-84fb9f9781e6/pioneer_fund.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201016T173331Z&X-Amz-Expires=86400&X-Amz-Signature=cef05e5508c6c87a8eb4abaafeca24bbfafe91d63db69e574c7a6108820d92c5&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22pioneer_fund.png%22",
      sharePrice:"120",
      round:"Series C",
      lastRoundDate:"7/12/2020",
      valuation:"2.35M",
      allocation:"10,000",
      percentDifference:"3.05",
      fees:"0",
      closeDate:"10/31/2020",
      }
  ];

  return (
    <div className="blue-container">
      <Grid
      container
      spacing={12}
      justify="space-between"
      style={{ marginTop: "40px", marginBottom: "1rem" }}
    >
    {deals.map(
          ({
            to,
            name,
            logo,
            sharePrice,
            round,
            lastRoundDate,
            valuation,
            allocation,
            percentDifference,
            fees,
            closeDate
          }) => (
      <Grid
        item
        xs={12}
        sm={12}
        md={4}
        style={{ border: "1em solid transparent" }}
      >
        <Paper style={{ minHeight: "100px" }}>
          <Grid container >
            {/* Row 1 */}
            <Grid item xs={12} sm={12} md={12} lg={12} 
            style={{ 
              display: 'flex', 
              paddingLeft: "0.1rem",
              paddingRight: "0.1rem", 
              justifyContent: "space-between", 
              alignContent: "center", 
              textAlign: "center",
              paddingBottom: "0.5rem", 
              paddingTop: "0.75rem", 
              marginBottom: "0rem", 
              marginTop: "0.5rem",
              borderBottom: "solid 0.25px rgba(0, 0, 0, 0.25)",
              boxShadow: "0 4px 2px -2px gray"
              }}
              >
              <Grid xs={1} sm={1} md={1} lg={1} ></Grid>
              <Grid xs={6} sm={6} md={6} lg={6} style={{display: "flex", justifyContent: "center", alignContent: "center", textAlign: "center"}} >
                  <img src={logo} alt="oops" style={{paddingLeft: "5px", width: "100%", height: "auto", textAlign: "center"}} />
              </Grid>
              <Grid xs={2} sm={2} md={2} lg={2} >
               {/*  <p
                  style={{
                    fontSize: '1.25rem',
                    color: "rgba(0,0,0,0.8)",
                  }}
                >
                  {name}
                </p>
                <p
                  style={{
                    fontSize: '0.5rem',
                    color: "rgba(0,0,0,0.8)",
                  }}
                >
                  Share Price: {sharePrice}
                </p>*/}
              </Grid> 
              <Grid xs={3} sm={3} md={3} lg={3} >
                  <Button variant="contained" color="secondary" size="small">LIKE</Button>
              </Grid>
            </Grid>

            {/* GREY BACKGROUND*/}
            <Grid xs={12} sm={12} md={12} lg={12} style={{ background: "rgba(0, 0, 0, 0.01)" }} > 
            {/* Row 2 - Round, Last Round, Valuation*/}
            <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', paddingLeft: "0.1rem", paddingRight: "0.1rem", paddingTop: "0.5rem", paddingBottom: "0.2rem", justifyContent: "space-between", textAlign: "center", marginBottom: "0.25rem", marginTop: "0.25rem"}} >
              <Grid xs={12} sm={4} md={4} lg={4} >
                <Typography style={{ fontSize: '0.5rem', color: "rgba(0,0,0,0.5)", letterSpacing: "1px" }}>ROUND</Typography>
                <Typography style={{ fontSize: '0.75rem', color: "rgba(0,0,0,0.85)", fontWeight: "900" }}>{round}</Typography>   
              </Grid>
              <Grid xs={12} sm={4} md={4} lg={4} >
                <Typography style={{ fontSize: '0.5rem', color: "rgba(0,0,0,0.5)", letterSpacing: "1px" }}>LAST ROUND</Typography>
                <Typography style={{ fontSize: '0.75rem', color: "rgba(0,0,0,0.85)", fontWeight: "900" }}>{lastRoundDate}</Typography>
              </Grid>
              <Grid xs={12} sm={4} md={4} lg={4} >
                <Typography style={{ fontSize: '0.5rem', color: "rgba(0,0,0,0.5)", letterSpacing: "1px" }}>VALUATION</Typography>
                <Typography style={{ fontSize: '0.75rem', color: "rgba(0,0,0,0.85)", fontWeight: "900" }}>{valuation}</Typography>
              </Grid>
            </Grid>
            {/* Row 3 - Allocation, %*/}
            <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', paddingLeft: "0.1rem", paddingRight: "0.1rem", paddingTop: "0.5rem", paddingBottom: "0.2rem", justifyContent: "space-between", textAlign: "center", marginBottom: "0.25rem", marginTop: "0.25rem"}}>
              <Grid xs={12} sm={4} md={4} lg={4} >
                <Typography style={{ fontSize: '0.5rem', color: "rgba(0,0,0,0.5)", letterSpacing: "1px" }}>ALLOCATION</Typography>
                <Typography style={{ fontSize: '0.75rem', color: "rgba(0,0,0,0.85)", fontWeight: "900" }}>{allocation}</Typography>   
              </Grid>
              <Grid xs={12} sm={4} md={4} lg={4} >
                <Typography style={{ fontSize: '0.5rem', color: "rgba(0,0,0,0.5)", letterSpacing: "1px" }}>% VS LAST ROUND</Typography>
                <Typography style={{ fontSize: '0.75rem', color: "rgba(0,0,0,0.85)", fontWeight: "900" }}>{percentDifference}</Typography>
              </Grid>
              <Grid xs={12} sm={4} md={4} lg={4} >
                <Typography style={{ fontSize: '0.5rem', color: "rgba(0,0,0,0.5)", letterSpacing: "1px" }}>FEES</Typography>
                <Typography style={{ fontSize: '0.75rem', color: "rgba(0,0,0,0.85)", fontWeight: "900" }}>$ 0.00</Typography>
              </Grid>
            </Grid>
      
            {/* Row 4 - Close Date*/}
            <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: "flex", paddingLeft: "0.75rem", paddingRight: "0.1rem", paddingTop: "0.5rem", paddingBottom: "0.2rem", justifyContent: "center", alignContent: "center", textAlign: "left", marginBottom: "0.5rem", marginTop: "0.25rem", borderTop: "solid 0.25px rgba(0, 0, 0, 0.25)", }}>
              <Grid xs={12} sm={6} md={6} lg={6} style={{paddingTop: "0.5rem", paddingLeft: "1em",}}>
                {name}
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6} style={{ display: "flex-column", alignContent: "center", justifyContent: "center", textAlign: "center" }}>
                <Typography xs={12} sm={6} md={6} lg={6} style={{ fontSize: '0.5rem', color: "rgba(0,0,0,0.5)", paddingRight: "10px" }}>CLOSE DATE </Typography>  
                <Typography xs={12} sm={6} md={6} lg={6} style={{ fontSize: '0.75rem', color: "rgba(0,0,0,0.85)" }}>{closeDate}</Typography>
                </Grid>
            </Grid>
            </Grid>

          </Grid>
        </Paper>
      </Grid>
        )
      )}
    </Grid>
    </div>
  );
}
