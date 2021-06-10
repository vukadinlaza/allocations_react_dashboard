import React from 'react';
import { SimpleBox, ChartBox } from '../widgets'


const Highlights = ({ classes }) => {

  return (
    <div className={classes.section}>
      <SimpleBox size="half" title="Committed" info="Explanation">Child</SimpleBox>
      <SimpleBox size="half" title="Closed" info="Explanation">Child</SimpleBox>
      <SimpleBox size="third" title="Portfolio Value" info="Explanation">Child</SimpleBox>
      <SimpleBox size="third" title="Total Invested" info="Explanation">Child</SimpleBox>
      <SimpleBox size="third" title="Multiple" info="Explanation">Child</SimpleBox>
      <div className={classes.subSection}>
        <ChartBox title="Portfolio Overview" info="Explanation">Child</ChartBox>
        <ChartBox title="Value" info="Explanation">Child</ChartBox>
      </div>
    </div>
  );
}

export default Highlights;
