const marketTabs = [
  {
    id: 1,
    title: 'Energy',
  },
  {
    id: 2,
    title: 'Coasts',
  },
];

//API
// My Holdings
//https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${orderBy}&per_page=${perPage}&page=${page}&sparkline=${sparkline}&price_change_percentage=${priceChangePerc}&ids=${ids}

// Coin Market
//https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${orderBy}&per_page=${perPage}&page=${page}&sparkline=${sparkline}&price_change_percentage=${priceChangePerc}

const constants = {
  marketTabs,
};

export default constants;
