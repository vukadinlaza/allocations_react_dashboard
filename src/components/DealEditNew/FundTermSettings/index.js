import React, { useEffect, useState } from 'react'
import { FormControl, TextField, Button } from '@material-ui/core';
import './styles.scss'

function FundTerms({ formData, setFormData }) {

  const [feeType, setFeeType] = useState('percentage')
  const [setupCostType, setSetupCostType] = useState('percentage')

  const {
    dealParams: {
      fundManagementFees,
      fundManagementFeesDollar,
      fundManagementFeeType,
      fundTotalCarry,
      fundGeneralPartner,
      fundEstimatedSetupCosts,
      fundEstimatedSetupCostsDollar,
      fundEstimatedTerm
    }
  } = formData;

  const getFeeType = () => {
    if (fundManagementFees?.length > 0) {
      setFeeType('percentage')
    } else if (fundManagementFeesDollar?.length > 0) {
      setFeeType('fixed')
    }
  }

  const getSetupCostType = () => {
    if (fundEstimatedSetupCosts?.length > 0) {
      setFeeType('percentage')
    } else if (fundEstimatedSetupCostsDollar?.length > 0) {
      setFeeType('fixed')
    }
  }

  useEffect(() => {
    getFeeType()
    getSetupCostType()
  }, [fundManagementFees, fundManagementFeesDollar])


  const handleFormChange = ({ target }) => {
    setFormData(prevData => ({
      ...prevData,
      dealParams: {
        ...prevData.dealParams,
        [target.name]: target.value
      }
    }))
  }

  const getManagementFee = () => {
    if (fundManagementFees?.length > 0 && feeType === 'percentage') {
      return fundManagementFees;
    }

    if (fundManagementFeesDollar?.length > 0 && feeType === 'fixed') {
      return fundManagementFeesDollar;
    }
  }


  const getSetupCosts = () => {
    if (fundEstimatedSetupCosts?.length > 0 && setupCostType === 'percentage') {
      return fundEstimatedSetupCosts;
    } 

    if (fundEstimatedSetupCostsDollar?.length > 0 && setupCostType === 'fixed') {
      return fundEstimatedSetupCostsDollar;
    }
  }

  const handleFeeChange = ({ target }) => {
    if (feeType === 'fixed') {
      setFormData(prevData => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          fundManagementFeesDollar: target.value,
          fundManagementFees: ''
        }
      }))
    } else {
      setFormData(prevData => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          fundManagementFees: target.value,
          fundManagementFeesDollar: ''
        }
      }))
    }
  }

  const handleSetupCostChange = ({ target }) => {
    if (setupCostType === 'fixed') {
      setFormData(prevData => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          fundEstimatedSetupCostsDollar: target.value,
          fundEstimatedSetupCosts: ''
        }
      }))
    } else {
      setFormData(prevData => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          fundEstimatedSetupCosts: target.value,
          fundEstimatedSetupCostsDollar: ''
        }
      }))
    }
  }

  const changeFundFeeType = type => {
    setFormData(prevData => ({
      ...prevData,
      dealParams: {
        ...prevData.dealParams,
        fundManagementFeeType: type
      }
    }))
  }


  return (
    <section className="FundTerms">
      <h2>Fund Terms</h2>

      <div className="form-fields">

        <FormControl className="field">
          <label className="field-label">
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
                  setFeeType('percentage')
                  setFormData(prevData => ({
                    ...prevData,
                    dealParams: {
                      ...prevData.dealParams,
                      fundManagementFees: fundManagementFeesDollar,
                      fundManagementFeesDollar: ''
                    }
                  }))
                }}
                className={`percentage ${feeType === 'percentage' && 'selected'}`}
                variant="outlined">
                %
              </Button>
              <Button
                onClick={() => {
                  setFeeType('fixed')
                  setFormData(prevData => ({
                    ...prevData,
                    dealParams: {
                      ...prevData.dealParams,
                      fundManagementFeesDollar: fundManagementFees,
                      fundManagementFees: ''
                    }
                  }))
                }}
                className={`fixed ${feeType === 'fixed' && 'selected'}`}
                variant="outlined">
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
                onClick={() => changeFundFeeType('Annual')}
                className={`option-button ${fundManagementFeeType === 'Annual' && 'selected'}`}
                variant="outlined">
                Annual
              </Button>
              <Button
                onClick={() => changeFundFeeType('One-Time')}
                className={`option-button ${fundManagementFeeType === 'One-Time' && 'selected'}`}
                variant="outlined">
                One-time
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Total carry (%)
            <TextField
              onChange={handleFormChange}
              value={fundTotalCarry || ''}
              name='fundTotalCarry'
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            General partner
            <TextField
              onChange={handleFormChange}
              value={fundGeneralPartner || ''}
              name='fundGeneralPartner'
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
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
                variant="outlined">
                %
              </Button>
              <Button
                onClick={() => setSetupCostType('fixed')}
                className={`percentage ${setupCostType === 'fixed' && 'selected'}`}
                variant="outlined">
                $
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Estimated term
            <TextField
              onChange={handleFormChange}
              value={fundEstimatedTerm || ''}
              name='fundEstimatedTerm'
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

      </div>

    </section>
  )
}

export default FundTerms
