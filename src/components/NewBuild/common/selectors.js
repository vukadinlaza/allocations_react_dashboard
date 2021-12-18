import React from 'react';
import Select from 'react-select';
import countries from 'country-region-data';
import { Button, ButtonGroup } from '@material-ui/core';
import { phone } from '../../../utils/helpers';
import useStyles from '../BuildStyles';

const phoneSize = window.innerWidth < phone;

export const ButtonSelector = ({ currentValue, name, values, onChange, gridCol = '1fr 1fr' }) => {
  const classes = useStyles();

  return (
    <ButtonGroup
      color="primary"
      aria-label="outlined primary button group"
      style={{
        display: 'grid',
        gridTemplateColumns: gridCol,
        width: phoneSize ? '325px' : '90%',
        gridGap: phoneSize ? '20px' : '10px',
      }}
    >
      {values.map(({ label, value }, i) => (
        <Button
          key={i}
          name={name}
          value={value}
          className={`${currentValue === value ? classes.selected : null} ${
            classes.selectorButton
          }`}
          onClick={(e) => {
            const target = {
              name: e.currentTarget.name,
              value: e.currentTarget.value,
            };
            e.target = target;
            onChange(e);
          }}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export function InternationalCountrySelector({
  handleChange,
  setUnfilledFields,
  unfilledFields,
  buildData,
}) {
  const countryNames = countries.map((c) => c.countryName);
  const placeHolder = 'Please select which countries';
  const customStyles = {
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: '#DAE8FF',
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: '#0461FF',
      height: 37,
      display: 'flex',
      alignItems: 'center',
      fontSize: '96%',
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: '#0461FF',
    }),
    control: (styles) => ({
      ...styles,
      marginTop: 50,
      minHeight: 60,
      width: phoneSize ? '325px' : '90%',
      maxWidth: 568,
      cursor: 'pointer',
      border: unfilledFields.includes('international_company_country')
        ? '2px solid red'
        : '1pm solid hsl(0, 0%, 80%)',
    }),
    placeholder: (styles, data) => ({
      ...styles,
      color: data.children === placeHolder ? '#999' : '#000',
    }),
  };

  return (
    <Select
      id="international_company_country"
      label="International Company by Country"
      menuPosition="fixed"
      styles={customStyles}
      value={buildData.international_company_country || ''}
      options={countryNames.map((country) => ({ value: country, label: country })) || ''}
      placeholder={buildData.international_company_country || placeHolder}
      onChange={(option) => {
        const newEvent = {
          target: {
            name: 'international_company_country',
            value: option.value,
          },
        };
        handleChange(newEvent);
        setUnfilledFields((prev) =>
          prev.filter((field) => field !== 'international_company_country'),
        );
      }}
    />
  );
}

export function InternationalInvestorsCountriesSelector({
  handleChange,
  setUnfilledFields,
  unfilledFields,
  buildData,
  countries,
}) {
  const countryNames = countries.map((c) => c.countryName);
  const placeHolder = 'Please select which countries';
  const customStyles = {
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: '#DAE8FF',
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: '#0461FF',
      height: 37,
      display: 'flex',
      alignItems: 'center',
      fontSize: '96%',
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: '#0461FF',
    }),
    control: (styles) => ({
      ...styles,
      marginTop: 50,
      minHeight: 60,
      width: phoneSize ? '325px' : '90%',
      maxWidth: 568,
      cursor: 'pointer',
      border: unfilledFields.includes('international_investors_countries')
        ? '2px solid red'
        : '1pm solid hsl(0, 0%, 80%)',
    }),
    placeholder: (styles, data) => ({
      ...styles,
      color: data.children === placeHolder ? '#999' : '#000',
    }),
  };

  return (
    <Select
      id="international_investors_countries"
      label="International Companies by Country"
      menuPosition="fixed"
      styles={customStyles}
      value={
        buildData.international_investors_countries.map((country) => ({
          value: country,
          label: country,
        })) || ''
      }
      options={countryNames.map((country) => ({ value: country, label: country })) || ''}
      placeholder={placeHolder || buildData.international_investors_countries}
      onChange={(option) => {
        const newEvent = {
          target: {
            name: 'international_investors_countries',
            value: option.map((country) => country.value),
          },
        };
        handleChange(newEvent);
        setUnfilledFields((prev) =>
          prev.filter((field) => field !== 'international_investors_countries'),
        );
      }}
      isMulti
    />
  );
}

export function DealStagesSelector({ handleChange, setUnfilledFields, unfilledFields, buildData }) {
  const dealStages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+'];
  const customStyles = {
    control: (styles) => ({
      ...styles,
      height: 60,
      maxWidth: 568,
      cursor: 'pointer',
      border: unfilledFields.includes('deal_stage') ? '2px solid red' : '1pm solid hsl(0, 0%, 80%)',
    }),
    placeholder: (styles, data) => ({
      ...styles,
      color: data.children !== 'Select...' ? '#000' : '#999',
    }),
  };

  return (
    <Select
      id="deal_stage"
      menuPosition="absolute"
      menuPlacement="top"
      label="Deal Stage"
      styles={customStyles}
      options={dealStages.map((stage) => ({ value: stage, label: stage, key: stage })) || ''}
      defaultValue={buildData.deal_stage}
      placeholder={buildData.deal_stage || 'Select...'}
      onChange={(option) => {
        const newEvent = {
          target: {
            name: 'deal_stage',
            value: option.value,
          },
        };
        handleChange(newEvent);
        setUnfilledFields((prev) => prev.filter((field) => field !== 'deal_stage'));
      }}
    />
  );
}

export function SecuritiesSelector({ handleChange, setUnfilledFields, unfilledFields, buildData }) {
  const securityTypes = [
    'Series A Preferred Stock',
    'Simple Agreement for Future Equity',
    'Convertible Promissory Note',
    'Other',
  ];
  const customStyles = {
    control: (styles) => ({
      ...styles,
      height: 60,
      maxWidth: 568,
      cursor: 'pointer',
      border: unfilledFields.includes('portfolio_company_securities')
        ? '2px solid red'
        : '1pm solid hsl(0, 0%, 80%)',
    }),
    placeholder: (styles, data) => ({
      ...styles,
      color: data.children !== 'Select...' ? '#000' : '#999',
    }),
  };

  return (
    <Select
      id="portfolio_company_securities"
      label="Portfolio Company Securities"
      styles={customStyles}
      options={securityTypes.map((security) => ({ value: security, label: security })) || ''}
      defaultValue={buildData.portfolio_company_securities}
      placeholder={buildData.portfolio_company_securities || 'Select...'}
      onChange={(option) => {
        const newEvent = {
          target: {
            name: 'portfolio_company_securities',
            value: option.value,
          },
        };
        handleChange(newEvent);
        setUnfilledFields((prev) =>
          prev.filter((field) => field !== 'portfolio_company_securities'),
        );
      }}
    />
  );
}
