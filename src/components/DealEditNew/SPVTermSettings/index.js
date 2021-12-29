import React, { useState, useEffect } from 'react';
import { FormControl, TextField, Button } from '@material-ui/core';
import './styles.scss';

function SPVTermSettings({ formData, setFormData, toggleDifferentSPVTerms }) {
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
    <section className="SPVTermSettings">
      <h2>SPV Terms</h2>

      <div className="form-fields">
        <FormControl className="field">
          <label className="field-label">
            Management fee
            <div className="management-fee">
              <TextField
                className="fee-input"
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
                className={`percentage ${feeType === 'percentage' ? 'selected' : ''}`}
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
                className={`fixed ${feeType === 'fixed' ? 'selected' : ''}`}
                name="managementFeeType"
                variant="outlined"
              >
                $
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Fee type
            <div className="button-options">
              <Button
                onClick={() => changeFeeType('Annual')}
                className={`option-button ${managementFeeType === 'Annual' && 'selected'}`}
                variant="outlined"
              >
                Annual
              </Button>
              <Button
                onClick={() => changeFeeType('One-Time')}
                className={`option-button ${managementFeeType === 'One-Time' && 'selected'}`}
                variant="outlined"
              >
                One-time
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Estimated setup cost ($)
            <TextField
              onChange={handleFormChange}
              value={estimatedSetupCosts}
              className="text-input"
              variant="outlined"
              name="estimatedSetupCosts"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Total carry (%)
            <TextField
              value={totalCarry || ''}
              name="totalCarry"
              onChange={handleFormChange}
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        {/* TODO: deal_lead or organizer? */}
        <FormControl className="field">
          <label className="field-label">
            Organizer
            <TextField
              value={deal_lead || ''}
              onChange={handleFormChange}
              name="deal_lead"
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Estimated term
            <TextField
              value={estimatedTerm || ''}
              name="estimatedTerm"
              onChange={handleFormChange}
              className="text-input"
              variant="outlined"
              placeholder="10 years"
            />
          </label>
        </FormControl>

        <FormControl className="wide-field">
          <label className="field-label">
            Does your portfolio company have different terms than your SPV? (SPV into an SPV)
            <div className="button-options">
              <Button
                onClick={() => toggleDifferentSPVTerms(true)}
                className={`option-button ${differentPortfolioTerms && 'selected'}`}
                variant="outlined"
              >
                Yes
              </Button>
              <Button
                onClick={() => toggleDifferentSPVTerms(false)}
                className={`option-button ${!differentPortfolioTerms && 'selected'}`}
                variant="outlined"
              >
                No
              </Button>
            </div>
          </label>
        </FormControl>
      </div>
    </section>
  );
}

export default SPVTermSettings;
