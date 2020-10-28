import axios from 'axios';

export default async (body) => {
  axios({
    method: 'post',
    url: 'https://hooks.zapier.com/hooks/catch/7904699/oqfry9n',
    data: body,
  });
};
