import { FormControl, TextField, Button } from '@material-ui/core'
import React from 'react'
import './styles.scss'
import CopyIcon from './copy-icon.svg'
import { toast } from 'react-toastify';

function DealSettings() {

  const handleLinkCopy = () => {
    navigator.clipboard.writeText('hello world')
    toast.success('Copied deal link to clipboard.')
  }

  return (
    <section className="DealSettings">
      <h2>Deal Settings</h2>

      <div className="form-fields">

        <FormControl className="field">
          <label className="field-label">
            Last valuation ($)
            <TextField
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
