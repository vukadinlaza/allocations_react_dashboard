const personalInfoValidation = (
  investor,
  org,
  requireSecondSigChecked = {},
  docSpringTemplateId,
  is3c7,
) => {
  let required = ['legalName', 'investor_type', 'country', 'accredited_investor_status'];
  if (is3c7) required.push('is3c7_options_status');

  if (org === 'irishangels' || (!is3c7 && investor.accredited_investor_status)) {
    required = required.filter((d) => d !== 'accredited_investor_status');
  }
  if (is3c7 && investor.is3c7_options_status) {
    required = required.filter(
      (d) => !['is3c7_options_status', 'accredited_investor_status'].includes(d),
    );
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
  if (docSpringTemplateId === 'tpl_eg24nTFZrC2Kqs3FMf') {
    required.push('tax_identification_number');
    required.push('address');
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
