// const currency = require('./currency');

// console.log(
//   '100 Canadian dollars equals this amount of US dollars:',
//   currency.canadianToUS(1000),
// );

// console.log(
//   '100 US dollars equals this amount of Canadian dollars:',
//   currency.USToCanadian(1000),
// );

/* ===================================================================== */

// 3.1.2

const Currency = require('./currency');

const currency = new Currency(0.91);

console.log(
  '10 Canadian dollars equals this amount of US dollars:',
  currency.canadianToUS(10),
);

console.log(
  '9.1 US dollars equals this amount of Canadian dollars:',
  currency.USToCanadian(9.1),
);
