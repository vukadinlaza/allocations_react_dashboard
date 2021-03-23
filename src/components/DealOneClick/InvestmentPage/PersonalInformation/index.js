import React from 'react'
import { TextField } from '@material-ui/core'
import './styles.scss'

function PersonalInformation() {
  return (
    <section className="PersonalInformationPanel">
      <p className="section-label">Personal Information</p>
      <TextField
        className="personal-information-input"
        variant="outlined"
        placeholder="Legal name"
      />
      <TextField
        className="personal-information-input"
        variant="outlined"
        placeholder="Full Address"
      />
      <TextField
        className="personal-information-input"
        variant="outlined"
        placeholder="Phone number"
      />
      <p className="information-notice">Required by United States banking laws. This information is transmitted securely and will never be used for any purpose beyond executing your investment.</p>
    </section>
  )
}

export default PersonalInformation
