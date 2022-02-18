// import axios from 'axios';

const axios = require('axios').default;

const URL = 'https://pixabay.com/api/';
const searchOption = {
  params: {
    key: '23292870-e9e1fc8f4fc8bd7151266ea82',
    q: `cat`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 0,
  },
};

async function getColection(query = searchOption.params.q) {
  searchOption.params.q = `${query}`;
  searchOption.params.page = searchOption.params.page + 1;

  const respons = await axios.get(URL, searchOption);

  if (respons.data.hits.length === 0) {
    throw new Error();
  }

  return respons;
}

export default getColection;
