const kote = require('../');

kote.on('B', (req) => console.log('i respond to B') || Promise.resolve('hi B!'));
kote.on('C', (req) => console.log('i respond to C') || Promise.resolve('hi C!'));


setTimeout(() => {
  kote.on('D', (req) => console.log('i respond to D') || Promise.resolve('hi D!'));

}, 15000)
