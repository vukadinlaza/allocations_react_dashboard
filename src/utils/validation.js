const personalInfoValidation = (investor, org, requireSecondSigChecked = {}) => {
  let required = ['legalName', 'investor_type', 'country', 'accredited_investor_status'];
  if (org === 'irishangels') {
    required = required.filter((d) => d !== 'accredited_investor_status');
  }
  if (investor.is3c7_options_status) {
    required = required.filter((d) => d !== 'accredited_investor_status');
  }
  if (investor.country && investor.country === 'United States') {
    required.push('state');
  }
  if (investor.investor_type === 'entity' && !investor.fullName) {
    required.push('fullName');
  }
  if (org === 'techstars') {
    required.push('cifusStatus');
  }

  let errors = [];
  errors = required.reduce((acc, attr) => (investor[attr] ? acc : [...acc, attr]), []);
  if (requireSecondSigChecked.secondSigInfo) {
    if (org === 'irishangels') {
      errors.push(
        'secondLegalName',
        'secondEmail',
        'secondSignerSSN',
        'secondSignerInitials',
        'secondSigConsent',
      );
    } else {
      errors.push('secondLegalName', 'secondEmail', 'secondSigConsent');
    }
    errors = errors.reduce(
      (acc, attr) => (investor.secondInvestor[attr] ? acc : [...acc, attr]),
      [],
    );
  }
  return errors;
};

export default personalInfoValidation;
