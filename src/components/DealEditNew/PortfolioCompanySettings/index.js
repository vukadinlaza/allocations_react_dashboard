import React, { useState, useEffect } from 'react';
import { FormControl, TextField, Button, FormLabel } from '@material-ui/core';
import useStyles from './styles';

function PortfolioCompanySettings({ formData, setFormData }) {
  const styles = useStyles();
  const [feeType, setFeeType] = useState('percentage');
  const [setupCostType, setSetupCostType] = useState('percentage');

  const {
    dealParams: {
      portfolioEstimatedSetupCosts,
      portfolioEstimatedSetupCostsDollar,
      portfolioManagementFeeType,
      portfolioManagementFees,
      portfolioManagementFeesDollar,
      portfolioTotalCarry,
    },
  } = formData;

  const getFeeType = () => {
    if (portfolioManagementFees?.length > 0) {
      setFeeType('percentage');
    } else if (portfolioManagementFeesDollar?.length > 0) {
      setFeeType('fixed');
    }
  };

  const getSetupCostType = () => {
    if (portfolioEstimatedSetupCosts?.length > 0) {
      setFeeType('percentage');
    } else if (portfolioEstimatedSetupCostsDollar?.length > 0) {
      setFeeType('fixed');
    }
  };

  useEffect(() => {
    getFeeType();
    getSetupCostType();
  }, [portfolioManagementFees, portfolioManagementFeesDollar]);

  const handleFormChange = ({ target }) => {
    setFormData((prevData) => ({
      ...prevData,
      dealParams: {
        ...prevData.dealParams,
        [target.name]: target.value,
      },
    }));
  };

  const handleFeeChange = ({ target }) => {
    if (feeType === 'fixed') {
      setFormData((prevData) => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          portfolioManagementFeesDollar: target.value,
          portfolioManagementFees: '',
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          portfolioManagementFees: target.value,
          portfolioManagementFeesDollar: '',
        },
      }));
    }
  };

  const getManagementFee = () => {
    if (portfolioManagementFees?.length > 0 && feeType === 'percentage') {
      return portfolioManagementFees;
    }

    if (portfolioManagementFeesDollar?.length > 0 && feeType === 'fixed') {
      return portfolioManagementFeesDollar;
    }
  };

  const getSetupCosts = () => {
    if (portfolioEstimatedSetupCosts?.length > 0 && setupCostType === 'percentage') {
      return portfolioEstimatedSetupCosts;
    }

    if (portfolioEstimatedSetupCostsDollar?.length > 0 && setupCostType === 'fixed') {
      return portfolioEstimatedSetupCostsDollar;
    }

    return '';
  };

  const handleSetupCostChange = ({ target }) => {
    if (setupCostType === 'fixed') {
      setFormData((prevData) => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          portfolioEstimatedSetupCostsDollar: target.value,
          portfolioEstimatedSetupCosts: '',
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          portfolioEstimatedSetupCosts: target.value,
          portfolioEstimatedSetupCostsDollar: '',
        },
      }));
    }
  };

  const changeFeeType = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      dealParams: {
        ...prevData.dealParams,
        portfolioManagementFeeType: type,
      },
    }));
  };

  return (
    <section className={styles.PortfolioCompanySettings}>
      <h2>SPV Terms</h2>

      <div className={styles.formFields}>
        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Portfolio management fee
            <div className={styles.managementFee}>
              <TextField
                onChange={handleFeeChange}
                value={getManagementFee()}
                className={styles.feeInput}
                variant="outlined"
              />
              <Button
                onClick={() => {
                  setFeeType('fixed');
                  setFormData((prevData) => ({
                    ...prevData,
                    dealParams: {
                      ...prevData.dealParams,
                      portfolioManagementFees: portfolioManagementFeesDollar,
                      portfolioManagementFeesDollar: '',
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
                      portfolioManagementFeesDollar: portfolioManagementFees,
                      portfolioManagementFees: '',
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
                onClick={() => changeFeeType('Annual')}
                className={`${styles.optionButton} ${
                  portfolioManagementFeeType === 'Annual' && styles.selected
                }`}
                variant="outlined"
              >
                Annual
              </Button>
              <Button
                onClick={() => changeFeeType('One-Time')}
                className={`${styles.optionButton} ${
                  portfolioManagementFeeType === 'One-Time' && styles.selected
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
            Portfolio carry fee (%)
            <TextField
              onChange={handleFormChange}
              value={portfolioTotalCarry}
              name="portfolioTotalCarry"
              className={styles.textInput}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Estimated setup cost
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
                className={`${styles.fixed} ${setupCostType === 'fixed' && styles.selected}`}
                variant="outlined"
              >
                $
              </Button>
            </div>
          </FormLabel>
        </FormControl>
      </div>
    </section>
  );
}

export default PortfolioCompanySettings;
