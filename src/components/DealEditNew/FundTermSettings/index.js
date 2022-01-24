import React, { useEffect, useState } from 'react';
import { FormControl, TextField, Button, FormLabel } from '@material-ui/core';
import './styles.scss';

function FundTerms({ formData, setFormData }) {
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
    <section className="FundTerms">
      <h2>Fund Terms</h2>

      <div className="form-fields">
        <FormControl className="field">
          <FormLabel className="field-label">
            Management fee
            <div className="management-fee">
              <TextField
                onChange={handleFeeChange}
                value={getManagementFee()}
                className="fee-input"
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
                      fundManagementFeesDollar: fundManagementFees,
                      fundManagementFees: '',
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
                onClick={() => changeFundFeeType('Annual')}
                className={`option-button ${fundManagementFeeType === 'Annual' && 'selected'}`}
                variant="outlined"
              >
                Annual
              </Button>
              <Button
                onClick={() => changeFundFeeType('One-Time')}
                className={`option-button ${fundManagementFeeType === 'One-Time' && 'selected'}`}
                variant="outlined"
              >
                One-time
              </Button>
            </div>
          </FormLabel>
        </FormControl>

        <FormControl className="field">
          <FormLabel className="field-label">
            Total carry (%)
            <TextField
              onChange={handleFormChange}
              value={fundTotalCarry || ''}
              name="fundTotalCarry"
              className="text-input"
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className="field">
          <FormLabel className="field-label">
            General partner
            <TextField
              onChange={handleFormChange}
              value={fundGeneralPartner || ''}
              name="fundGeneralPartner"
              className="text-input"
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className="field">
          <FormLabel className="field-label">
            Estimated setup cost ($)
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
                className={`percentage ${setupCostType === 'fixed' && 'selected'}`}
                variant="outlined"
              >
                $
              </Button>
            </div>
          </FormLabel>
        </FormControl>

        <FormControl className="field">
          <FormLabel className="field-label">
            Estimated term
            <TextField
              onChange={handleFormChange}
              value={fundEstimatedTerm || ''}
              name="fundEstimatedTerm"
              className="text-input"
              variant="outlined"
            />
          </FormLabel>
        </FormControl>
      </div>
    </section>
  );
}

export default FundTerms;
