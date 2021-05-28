import { FormControl, TextField, Button } from '@material-ui/core'
import React, { useState } from 'react'
import './styles.scss'
import CopyIcon from '../../../assets/copy-icon.svg'
import { toast } from 'react-toastify';

function DealSettings({ formData, setFormData }) {

  const [logo, setLogo] = useState(null);
  const [wireInstructions, setWireInstructions] = useState(null);
  const [documents, setDocuments] = useState(null);

  const handleLinkCopy = () => {
    navigator.clipboard.writeText('hello world')
    toast.success('Copied deal link to clipboard.')
  }

  const handleFormChange = ({ target }) => {
    const dealParamFields = ['managementFees', 'managementFeeType', 'estimatedTerm', 'totalCarry', 'estimatedSetupCosts']

    if (dealParamFields.includes(target.name)) {
      return setFormData(prevData => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          [target.name]: target.value
        }
      }))
    }
  }

  console.log('image changed', logo)

  const {
    last_valuation
  } = formData

  return (
    <section className="DealSettings">
      <h2>Deal Settings</h2>

      <div className="form-fields">

        <FormControl className="field">
          <label className="field-label">
            Last valuation ($)
            <TextField
              value={last_valuation || ''}
              name="last_valuation"
              onChange={handleFormChange}
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            DocSpring Template ID
            <TextField
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        {/* 

        <Grid item xs={12} sm={3}>
          <Button fullWidth variant="contained" component="label" style={{ height: 39 }}>
            Attach
            <input
              type="file"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={({ target }) => {
                if (target.validity.valid) setLogo({ logo: target.files[0] });
              }}
            />
          </Button>
        </Grid>
        
        */}

        <FormControl className="upload">
          <label className="field-label">
            Upload cover photo
            <div className="upload-container">
              <div className="button-container">
                <Button
                  className="attach-button"
                  variant="contained"
                  component="label"
                >
                  Attach
                  {/* <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={({ target }) => {
                      if (target.validity.valid) {
                        setLogo({ logo: target.files[0] });
                      }
                    }}
                  /> */}
                </Button>
                <p>Filename.png</p>

              </div>
              <Button className="upload-button">
                Upload to deal
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="upload">
          <label className="field-label">
            Upload wire instructions
            <div className="upload-container">
              <div className="button-container">
                <Button
                  className="attach-button"
                  variant="contained"
                  component="label"
                >
                  Attach
                  <input
                    type="file"
                    hidden
                  />
                </Button>
                <p>Filename.png</p>

              </div>
              <Button className="upload-button">
                Upload to deal
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="upload">
          <label className="field-label">
            Upload documents
            <div className="upload-container">
              <div className="button-container">
                <Button
                  className="attach-button"
                  variant="contained"
                  component="label"
                >
                  Attach
                  <input
                    type="file"
                    hidden
                  />
                </Button>
                <p>Filename.png</p>

              </div>
              <Button className="upload-button">
                Upload to deal
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Deal ID
            <TextField
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Live deal link
            <TextField
              className="text-input"
              variant="outlined"
              InputProps={{
                endAdornment: <Button
                  onClick={handleLinkCopy}
                  className="copy-button">
                  <img src={CopyIcon} />
                </Button>
              }}
            />
          </label>
        </FormControl>

      </div>

    </section>
  )
}

export default DealSettings
