import React, { useState, useEffect } from 'react';
import { FormControl, TextField, Button, FormLabel } from '@material-ui/core';
import useStyles from './styles';

function SPVTermSettings({ formData, setFormData, toggleDifferentSPVTerms }) {
  const styles = useStyles();
  const [feeType, setFeeType] = useState(null);
  const {
    _id,
    dealParams: {
      managementFees,
      managementFeesDollar,
      managementFeeType,
      estimatedTerm,
      totalCarry,
      estimatedSetupCosts,
    },
    differentPortfolioTerms,
    deal_lead,
  } = formData;

  const getFeeType = () => {
    if (managementFees?.length > 0) {
      setFeeType('percentage');
    } else if (managementFeesDollar?.length > 0) {
      setFeeType('fixed');
    }
  };

  useEffect(() => {
    getFeeType();
  }, [_id]);

  const handleFormChange = ({ target }) => {
    const dealParamFields = [
      'managementFees',
      'managementFeeType',
      'estimatedTerm',
      'totalCarry',
      'estimatedSetupCosts',
    ];

    if (dealParamFields.includes(target.name)) {
      return setFormData((prevData) => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          [target.name]: target.value,
        },
      }));
    }

    return setFormData((prevData) => ({
      ...prevData,
      [target.name]: target.value,
    }));
  };

  const getManagementFee = () => {
    if (managementFees?.length > 0) {
      return managementFees;
    }
    if (managementFeesDollar?.length > 0) {
      return managementFeesDollar;
    }

    return '';
  };

  const changeFeeType = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      dealParams: {
        ...prevData.dealParams,
        managementFeeType: type,
      },
    }));
  };

  const handleFeeChange = ({ target }) => {
    if (feeType === 'fixed') {
      setFormData((prevData) => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          managementFeesDollar: target.value,
          managementFees: '',
        },
      }));
    } else if (feeType === 'percentage') {
      setFormData((prevData) => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          managementFees: target.value,
          managementFeesDollar: '',
        },
      }));
    }
  };

  return (
    <section className={styles.spvTermSettings}>
      <h2>SPV Terms</h2>

      <div className={styles.formFields}>
        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Management fee
            <div className={styles.managementFee}>
              <TextField
                className={styles.feeInput}
                name={feeType === 'percentage' ? 'managementFees' : 'managementFeesDollar'}
                variant="outlined"
                onChange={handleFeeChange}
                value={getManagementFee()}
              />
              <Button
                onClick={() => {
                  setFeeType('percentage');
                  setFormData((prevData) => ({
                    ...prevData,
                    dealParams: {
                      ...prevData.dealParams,
                      managementFees: managementFeesDollar,
                      managementFeesDollar: '',
                    },
                  }));
                }}
                className={`${styles.percentage} ${
                  feeType === 'percentage' ? styles.selected : ''
                }`}
                name="managementFeeType"
                variant="outlined"
              >
                %
              </Button>
              <Button
                onClick={() => {
                  setFeeType('fixed');
                  setFormData((prevData) => ({
                    ...prevData,
                    dealParams: {
                      ...prevData.dealParams,
                      managementFeesDollar: managementFees,
                      managementFees: '',
                    },
                  }));
                }}
                className={`${styles.fixed} ${feeType === 'fixed' ? styles.selected : ''}`}
                name="managementFeeType"
                variant="outlined"
              >
                $
              </Button>
            </div>
          </FormLabel>
        </FormControl>

        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Fee type
            <div className={styles.buttonOptions}>
              <Button
                onClick={() => changeFeeType('Annual')}
                className={`${styles.optionButton} ${
                  managementFeeType === 'Annual' && styles.selected
                }`}
                variant="outlined"
              >
                Annual
              </Button>
              <Button
                onClick={() => changeFeeType('One-Time')}
                className={`${styles.optionButton} ${
                  managementFeeType === 'One-Time' && styles.selected
                }`}
                variant="outlined"
              >
                One-time
              </Button>
            </div>
          </FormLabel>
        </FormControl>

        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Estimated setup cost ($)
            <TextField
              onChange={handleFormChange}
              value={estimatedSetupCosts}
              className={styles.textInput}
              variant="outlined"
              name="estimatedSetupCosts"
            />
          </FormLabel>
        </FormControl>

        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Total carry (%)
            <TextField
              value={totalCarry || ''}
              name="totalCarry"
              onChange={handleFormChange}
              className={styles.textInput}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        {/* TODO: deal_lead or organizer? */}
        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Organizer
            <TextField
              value={deal_lead || ''}
              onChange={handleFormChange}
              name="deal_lead"
              className={styles.textInput}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Estimated term
            <TextField
              value={estimatedTerm || ''}
              name="estimatedTerm"
              onChange={handleFormChange}
              className={styles.textInput}
              variant="outlined"
              placeholder="10 years"
            />
          </FormLabel>
        </FormControl>

        <FormControl className={styles.wideField}>
          <FormLabel className={styles.fieldLabel}>
            Does your portfolio company have different terms than your SPV? (SPV into an SPV)
            <div className={styles.buttonOptions}>
              <Button
                onClick={() => toggleDifferentSPVTerms(true)}
                className={`${styles.optionButton} ${differentPortfolioTerms && styles.selected}`}
                variant="outlined"
              >
                Yes
              </Button>
              <Button
                onClick={() => toggleDifferentSPVTerms(false)}
                className={`${styles.optionButton} ${!differentPortfolioTerms && styles.selected}`}
                variant="outlined"
              >
                No
              </Button>
            </div>
          </FormLabel>
        </FormControl>
      </div>
    </section>
  );
}

export default SPVTermSettings;
