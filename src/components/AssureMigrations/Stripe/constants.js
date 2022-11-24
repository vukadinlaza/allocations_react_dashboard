export const currentPrice = 99;

export const paymentMethods = [
  {
    name: 'bank',
    icon: 'account_balance',
    label: 'US Bank Account',
  },
  {
    name: 'card',
    icon: 'credit_card',
    label: 'Card',
  },
];

export const fields = {
  bank: [
    {
      name: 'email',
      label: 'Email',
    },
    {
      name: 'full_name',
      label: 'Full name',
    },
    {
      name: 'bank_account',
      label: 'Bank account',
      placeholder: 'Search your bank account by name',
    },
  ],
  card: [
    {
      name: 'email',
      label: 'Email',
    },
    {
      name: 'card_number',
      label: 'Card number',
      type: 'number',
      maxLength: 16,
    },
    {
      name: 'expiration',
      label: 'Expiration',
      type: 'number',
      placeholder: 'MM/YYYY',
      maxLength: 7,
      md: 6,
    },
    {
      name: 'cvc',
      label: 'CVC',
      type: 'number',
      maxLength: 3,
      md: 6,
    },
  ],
};
