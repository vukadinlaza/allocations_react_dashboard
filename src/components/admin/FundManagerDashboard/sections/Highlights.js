import React from 'react';
import { Typography } from '@material-ui/core';
import { SimpleBox, ChartBox } from '../widgets'


const Highlights = ({ classes }) => {

  return (
    <div className={classes.section}>
      {/*
        <SimpleBox size="half" title="Committed" info="Explanation">Child</SimpleBox>
        <SimpleBox size="half" title="Closed" info="Explanation">Child</SimpleBox>
      */}
      <SimpleBox size="third" title="Portfolio Value" info="Explanation">
        <div className={classes.simpleBoxDataRow} style={{flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{fontSize: "26px"}}>$2,094,293</Typography>
          <Typography style={{fontSize: "10px"}}>0% Realized | 100% Unrealized</Typography>
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Total Invested" info="Explanation">
        <div className={classes.simpleBoxDataRow} style={{flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{fontSize: "26px"}}>$339,500</Typography>
          <Typography style={{fontSize: "10px"}}>32 Investments</Typography>
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Multiple" info="Explanation">
        <div className={classes.simpleBoxDataRow} style={{flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{fontSize: "26px"}}>1.00x</Typography>
          <Typography style={{fontSize: "10px"}}>Last Updated: June 1st, 2021</Typography>
        </div>
      </SimpleBox>
      <div className={classes.subSection}>
        <ChartBox title="Portfolio Overview" info="Explanation">Child</ChartBox>
        <ChartBox title="Value" info="Explanation">Child</ChartBox>
      </div>
    </div>
  );
}

export default Highlights;
