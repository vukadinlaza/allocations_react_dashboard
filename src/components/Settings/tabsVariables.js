export const getTabVariables = (tab) => {
  let gqlQuery = '';
  let headers = [];
  let dataVariable = '';
  let defaultSortField = ""

  switch (tab) {
    case 0:
      gqlQuery =`
        query AllUsers($pagination: PaginationInput!) {
          allUsers(pagination: $pagination) {
            _id
            first_name
            last_name
            email
            entity_name
            investments{
              _id
            }
          }
        }`;

      headers = [
        { value: 'first_name', label: 'First Name', isFilter: true },
        { value: 'last_name', label: 'Last Name', isFilter: true },
        { value: 'email', label: 'Email', isFilter: true },
        { value: 'entity_name', label: 'Entity', isFilter: true },
        { value: 'investments', label: 'Investments', type: 'count', align: 'center', alignHeader: true },
        { value: 'dashboard', label: 'Dashboard', keyNotInData: true, type: 'link', align: 'center', alignHeader: true },
      ]

      dataVariable = 'allUsers';
      defaultSortField = "first_name";

      break;

    case 1:
      gqlQuery =`
        query InvestmentsList($pagination: PaginationInput!) {
          investmentsList(pagination: $pagination) {
            _id
            amount
            deal {
              _id
              company_name
            }
            status
            investor {
              _id
              email
            }
          }
        }`;

      headers = [
        { value: 'investor', label: 'Investor', isFilter: true, type: 'investor', nestedKey: 'email', nestedCollection: 'users', localFieldKey: 'user_id' },
        { value: 'deal', label: 'Deal', isFilter: true, type: 'deal', nestedKey: 'company_name', nestedCollection: 'deals', localFieldKey: 'deal_id' },
        { value: 'status', label: 'Status', isFilter: true },
        { value: 'amount', label: 'Amount', type: 'amount', align: 'right', isFilter: true },
      ]

      dataVariable = 'investmentsList';
      defaultSortField = "status"

      break;

    default:
      console.log('tab does not exist');
      break;
  }

  return { gqlQuery, headers, dataVariable, defaultSortField }
}
