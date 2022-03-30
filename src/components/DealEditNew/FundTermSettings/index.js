import React, { useEffect, useState } from 'react';
import { FormControl, TextField, Button, FormLabel } from '@material-ui/core';
import useStyles from './styles';

function FundTerms({ formData, setFormData }) {
  const styles = useStyles();
  const [feeType, setFeeType] = useState(null);
  const [setupCostType, setSetupCostType] = useState(null);

  const {
    _id,
    dealParams: {
      fundManagementFees,
      fundManagementFeesDollar,
      fundManagementFeeType,
      fundTotalCarry,
      fundGeneralPartner,
      fundEstimatedSetupCosts,
      fundEstimatedSetupCostsDollar,
      fundEstimatedTerm,
    },
  } = formData;

  const getFeeType = () => {
    if (fundManagementFees?.length > 0) {
      setFeeType('percentage');
    } else if (fundManagementFeesDollar?.length > 0) {
      setFeeType('fixed');
    }
  };

  const getSetupCostType = () => {
    if (fundEstimatedSetupCosts?.length > 0) {
      setSetupCostType('percentage');
    } else if (fundEstimatedSetupCostsDollar?.length > 0) {
      setSetupCostType('fixed');
    }
  };

  useEffect(() => {
    getFeeType();
    getSetupCostType();
  }, [_id]);

  const handleFormChange = ({ target }) => {
    setFormData((prevData) => ({
      ...prevData,
      dealParams: {
        ...prevData.dealParams,
        [target.name]: target.value,
      },
    }));
  };

  const getManagementFee = () => {
    if (fundManagementFees?.length > 0) {
      return fundManagementFees;
    }

    if (fundManagementFeesDollar?.length > 0) {
      return fundManagementFeesDollar;
    }

    return '';
  };

  const getSetupCosts = () => {
    if (fundEstimatedSetupCosts?.length > 0) {
      return fundEstimatedSetupCosts;
    }

    if (fundEstimatedSetupCostsDollar?.length > 0) {
      return fundEstimatedSetupCostsDollar;
    }

    return '';
  };

  const handleFeeChange = ({ target }) => {
    if (feeType === 'fixed') {
      setFormData((prevData) => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          fundManagementFeesDollar: target.value,
          fundManagementFees: '',
        },
      }));
    } else if (feeType === 'percentage') {
      setFormData((prevData) => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          fundManagementFees: target.value,
          fundManagementFeesDollar: '',
        },
      }));
    }
  };

  const handleSetupCostChange = ({ target }) => {
    if (setupCostType === 'fixed') {
      setFormData((prevData) => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          fundEstimatedSetupCostsDollar: target.value,
          fundEstimatedSetupCosts: '',
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          fundEstimatedSetupCosts: target.value,
          fundEstimatedSetupCostsDollar: '',
        },
      }));
    }
  };

  const changeFundFeeType = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      dealParams: {
        ...prevData.dealParams,
        fundManagementFeeType: type,
      },
    }));
  };

  return (
    <section className={styles.fundTerms}>
      <h2>Fund Terms</h2>

      <div className={styles.formFields}>
        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Management fee
            <div className={styles.managementFee}>
              <TextField
                onChange={handleFeeChange}
                value={getManagementFee()}
                className={styles.feeInput}
                variant="outlined"
              />
              <Button
                onClick={() => {
                  setFeeType('percentage');
                  setFormData((prevData) => ({
                    ...prevData,
                    dealParams: {
                      ...prevData.dealParams,
                      fundManagementFees: fundManagementFeesDollar,
                      fundManagementFeesDollar: '',
                    },
                  }));
                }}
                className={`${styles.percentage} ${feeType === 'percentage' && styles.selected}`}
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
                      fundManagementFeesDollar: fundManagementFees,
                      fundManagementFees: '',
                    },
                  }));
                }}
                className={`${styles.fixed} ${feeType === 'fixed' && styles.selected}`}
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
                onClick={() => changeFundFeeType('Annual')}
                className={`${styles.optionButton} ${
                  fundManagementFeeType === 'Annual' && styles.selected
                }`}
                variant="outlined"
              >
                Annual
              </Button>
              <Button
                onClick={() => changeFundFeeType('One-Time')}
                className={`${styles.optionButton} ${
                  fundManagementFeeType === 'One-Time' && styles.selected
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
            Total carry (%)
            <TextField
              onChange={handleFormChange}
              value={fundTotalCarry || ''}
              name="fundTotalCarry"
              className={styles.textInput}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            General partner
            <TextField
              onChange={handleFormChange}
              value={fundGeneralPartner || ''}
              name="fundGeneralPartner"
              className={styles.textInput}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Estimated setup cost ($)
            <div className={styles.managementFee}>
              <TextField
                onChange={handleSetupCostChange}
                value={getSetupCosts()}
                className={styles.feeInput}
                variant="outlined"
              />
              <Button
                onClick={() => setSetupCostType('percentage')}
                className={`${styles.percentage} ${
                  setupCostType === 'percentage' && styles.selected
                }`}
                variant="outlined"
              >
                %
              </Button>
              <Button
                onClick={() => setSetupCostType('fixed')}
                className={`${styles.percentage} ${setupCostType === 'fixed' && styles.selected}`}
                variant="outlined"
              >
                $
              </Button>
            </div>
          </FormLabel>
        </FormControl>

        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Estimated term
            <TextField
              onChange={handleFormChange}
              value={fundEstimatedTerm || ''}
              name="fundEstimatedTerm"
              className={styles.textInput}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>
      </div>
    </section>
  );
}

export default FundTerms;
