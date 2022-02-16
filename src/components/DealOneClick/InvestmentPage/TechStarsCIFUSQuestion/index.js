import React, { useState } from 'react';
import { get } from 'lodash';
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  FormHelperText,
} from '@material-ui/core';
import { PanelContainer, PanelLabel } from '../../../Panel';
import useStyles from './styles';

function TechStarsCIFUSQuestion({ setInvestor, errors, org, isFromModal = false }) {
  if (org !== 'techstars') return null;

  const classes = useStyles();
  const handleChange = (event) => {
    setInvestor((prev) => ({
      ...prev,
      cifusStatus: event.target.value,
    }));
  };

  const options = [
    {
      short: 'A “foreign national”',
      long: '(i.e., an individual that is other than a “U.S. national”). For purposes of the CFIUS Regulations, a “U.S. national” is (1) a citizen of the United States or (2) an individual who, although not a citizen of the United States, owes a permanent allegiance to the United States. Note that “green card” holders are not U.S. nationals, but dual citizens (i.e., individuals who are citizens of the United States and another country) are U.S. nationals.',
    },
    {
      short: 'A “foreign government”',
      long: ' (i.e., any government or body exercising governmental functions, other than the United States Government or a subnational government of the United States). Note that the term “foreign government” includes, without limitation, national and subnational governments, including their respective departments, agencies and instrumentalities.',
    },
    {
      short: 'A “foreign entity”',
      long: '(i.e., any branch, partnership, group or sub-group, association, estate, trust, corporation, limited liability company or equivalent legal entity or organization that is organized or incorporated under the laws of a foreign (i.e., non-United States) jurisdiction) if either (i) the entity’s “principal place of business” is outside the United States or (ii) the entity’s equity securities are primarily traded on one or more foreign exchanges. Note that: (1) for purposes of this representation, the term “principal place of business” means the primary location where an entity’s management directs, controls, or coordinates the entity’s activities; (2) for entities that are investment funds, the term “principal place of business” is where the fund’s activities and investments are primarily directed, controlled, or coordinated by or on behalf of the general partner, managing member, or equivalent; and (3) if an investment fund has stated to a government authority that its principal place of business, principal office, headquarters, or equivalent is outside the United States, then the location identified in such statement is deemed for purposes of this representation to be the entity’s principal place of business unless the entity can demonstrate that such location has changed to the United States since making such statement.',
    },
    {
      short: 'A “foreign-controlled entity”',
      long: '(i.e., any entity over which control in any form is exercised or exercisable by a foreign national, foreign government or foreign entity). For purposes of the CFIUS Regulations, “control” means the power, direct or indirect, whether exercised or not exercised, to determine, direct or decide important matters affecting an entity, and includes negative control (i.e., the ability to prevent an entity from taking actions with respect to an important matter).',
    },
    {
      short: 'Not a “foreign person”',
      long: 'under any of the above definitions or otherwise as defined under the CFIUS Regulations.',
    },
  ];

  return (
    <PanelContainer isFromModal={isFromModal}>
      <PanelLabel label="CFIUS Foreign Person Status Representations" isFromModal={isFromModal} />
      <FormControl style={{ padding: '2rem' }}>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          onChange={handleChange}
        >
          {options.map((o) => {
            return (
              <Tooltip title={o.long}>
                <FormControlLabel
                  value={o.short}
                  control={<Radio />}
                  label={o.short}
                  className={classes.radioButton}
                />
              </Tooltip>
            );
          })}
        </RadioGroup>
        {errors.includes('cifusStatus') && (
          <FormHelperText style={{ color: 'red' }}>Please Select an option</FormHelperText>
        )}
      </FormControl>
    </PanelContainer>
  );
}

export default TechStarsCIFUSQuestion;
