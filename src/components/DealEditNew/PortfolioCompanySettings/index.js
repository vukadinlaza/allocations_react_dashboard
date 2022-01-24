import React, { useState, useEffect } from 'react';
import { FormControl, TextField, Button, FormLabel } from '@material-ui/core';
import './styles.scss';

function PortfolioCompanySettings({ formData, setFormData }) {
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
    <section className="PortfolioCompanySettings">
      <h2>SPV Terms</h2>

      <div className="form-fields">
        <FormControl className="field">
          <FormLabel className="field-label">
            Portfolio management fee
            <div className="management-fee">
              <TextField
                onChange={handleFeeChange}
                value={getManagementFee()}
                className="fee-input"
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
                className={`percentage ${feeType === 'percentage' && 'selected'}`}
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
                className={`fixed ${feeType === 'fixed' && 'selected'}`}
                variant="outlined"
              >
                $
              </Button>
            </div>
          </FormLabel>
        </FormControl>

        <FormControl className="field">
          <FormLabel className="field-label">
            Fee type
            <div className="button-options">
              <Button
                onClick={() => changeFeeType('Annual')}
                className={`option-button ${portfolioManagementFeeType === 'Annual' && 'selected'}`}
                variant="outlined"
              >
                Annual
              </Button>
              <Button
                onClick={() => changeFeeType('One-Time')}
                className={`option-button ${
                  portfolioManagementFeeType === 'One-Time' && 'selected'
                }`}
                variant="outlined"
              >
                One-time
              </Button>
            </div>
          </FormLabel>
        </FormControl>

        <FormControl className="field">
          <FormLabel className="field-label">
            Portfolio carry fee (%)
            <TextField
              onChange={handleFormChange}
              value={portfolioTotalCarry}
              name="portfolioTotalCarry"
              className="text-input"
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className="field">
          <FormLabel className="field-label">
            Estimated setup cost
            <div className="management-fee">
              <TextField
                onChange={handleSetupCostChange}
                value={getSetupCosts()}
                className="fee-input"
                variant="outlined"
              />
              <Button
                onClick={() => setSetupCostType('percentage')}
                className={`percentage ${setupCostType === 'percentage' && 'selected'}`}
                variant="outlined"
              >
                %
              </Button>
              <Button
                onClick={() => setSetupCostType('fixed')}
                className={`fixed ${setupCostType === 'fixed' && 'selected'}`}
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
