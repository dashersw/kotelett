const kote = require('../');

kote.on('A', (req) => console.log('i respond to A') || Promise.resolve('hi A!'));
kote.on('B', (req) => console.log('i respond to B') || Promise.resolve('hi B!'));
