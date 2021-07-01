export const getDisplayName = ({ investor = {} }) => {
  const { investorType, first_name, last_name, entity_name, email } = (investor = {});
  if (first_name && last_name) {
    return `${first_name} ${last_name}`;
  }
  if (email) {
    return email;
  }
  if (investorType === 'entity') {
    return entity_name;
  }
  return 'No Display Name';
};
