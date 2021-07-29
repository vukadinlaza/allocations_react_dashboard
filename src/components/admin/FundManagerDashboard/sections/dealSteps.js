export const dealSteps = {
  buildSteps: [
    {
      value: 'Initial Build Complete',
      tooltip: 'Completed http://build.allocations.com/',
      processStreetTask: ['enter deal details'],
    },
    {
      value: 'Services Agreement Signed',
      tooltip: 'Signed the Services Agreement',
      processStreetTask: ['review build submission'],
    },
    {
      value: 'ID Uploaded',
      tooltip: 'This is a KYC requirement internally reviewed by the Allocations compliance team',
      processStreetTask: ['review build submission'],
    },
    {
      value: 'Investment Docs Uploaded',
      tooltip:
        'Uploaded investment documents for Portfolio Company. This is internally reviewed by the Allocations compliance team to determine whether Allocations can power the deal.',
      processStreetTask: ['review build submission'],
    },
    {
      value: 'Portfolio Company Deck Uploaded',
      tooltip:
        'Uploaded Deck for Portfolio Company. This is internally reviewed by the Allocations compliance team to determine whether Allocations can power the deal.',
      processStreetTask: ['review build submission'],
    },
  ],
  preOnboardingSteps: [
    {
      value: 'SS4 Document Signed',
      tooltip: 'The process to request an EIN for the entity using the SSN of the fund manager',
      processStreetTask: ['apply for ein'],
    },
    {
      value: 'Entity Formation Complete',
      tooltip: 'The process of establishing the entity in Delaware',
      processStreetTask: ['entity formed and cof saved'],
    },
    {
      value: 'Bank Account Opened',
      tooltip:
        'The process of setting up a bank account. The ETA is dependent on KYC / AML checks made by the bank',
      processStreetTask: [
        'frb confirm wire instructions',
        'mercury bank confirm wire instructions',
      ],
    },
    {
      value: 'Private Fund Docs Signing Complete',
      tooltip:
        'The process of reviewing the documents for the private fund and pre-signature from the fund manager.',
      processStreetTask: ['spv documents pre-signed'],
    },
  ],
  onboardingSteps: [
    {
      value: 'Investor Onboarding List Uploaded',
      tooltip:
        'This is the list of investors and proposed investment amounts provided by the fund manager in Google Sheets',
      processStreetTask: ['investor list provided'],
    },
    {
      value: 'Final Set Up Confirmation Review Complete',
      tooltip: 'This is the process for the fund manager to review carry & management fees', //Same tooltip?
      processStreetTask: ['confirmation from fm ready to onboard'],
    },
    {
      value: 'Onboarding Email Sent',
      tooltip: 'This is the investor onboarding email sent to the investors',
      processStreetTask: ['send onboarding email'],
    },
    {
      value: 'Investor Follow Up Sent',
      tooltip: 'This is the follow up investor onboarding email sent to investors',
      processStreetTask: ['provide update to fm on deal status'],
    },
    {
      value: '506b/c Review Complete',
      tooltip: 'This is the process for the fund manager to review 506b/506c investor status',
      processStreetTask: [''], //Which task?
    },
    {
      value: 'KYC Review Complete',
      tooltip: 'This is the process for Allocations to perform a soft KYC check on investors',
      processStreetTask: ['kyc complete'],
    },
  ],
  closingSteps: [
    {
      value: 'Portfolio Company Wire Info Uploaded',
      tooltip: 'Uploaded Portfolio Company Wire Instructions',
      processStreetTask: ['wire out to portfolio company'], //Cant find task
    },
    {
      value: 'Investor Ledger Reconciliation Complete',
      tooltip: 'The process of reconciling wires from investors. E.g. double checking wire fees',
      processStreetTask: ['audit wires and signatures'],
    },
    {
      value: 'Blue Sky Fees Review Complete',
      tooltip: 'The process of reviewing blue sky fees',
      processStreetTask: ['confirm bluesky fees'],
    },
    {
      value: 'Signed Portfolio Company Documents',
      tooltip: 'The process for signing portfolio company documents',
      processStreetTask: ['signed portfolio company agreement received'],
    },
    {
      value: 'Wire Approval Review Complete',
      tooltip: 'The process to approval the wire to the portfolio company. 12pm EST cutoff time.',
      processStreetTask: ['confirm wire instructions', 'confirm fees with fund manager'],
    },
    {
      value: 'Invoice Receipt Sent',
      tooltip: 'The process of sending invoice receipt to the fund manager',
      processStreetTask: ['invoice ready', 'invoice ready (10 x fee raised)'],
    },
    {
      value: 'Reg D Filing Complete',
      tooltip: 'The process of filing a Reg D for the offering',
      processStreetTask: ['review and submit bluesky submission'],
    },
    {
      value: 'Management Fee Distribution Complete',
      tooltip: 'The process of distributing the management fee to the Fund Manager',
      processStreetTask: ['wire out management fee'],
    },
  ],
};
