const crypto = require('crypto');

var hashString = crypto.createHash('md5').update('banana').digest('hex');
var salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
console.log('hashing ' + "'" + 'banana' + "'" + ' = ' + hashString);
console.log('Randomly generated Salt 1 = ' + salt);

var saltedHash = crypto.createHash('md5').update('banana' + salt).digest('hex');
console.log('hashing ' + "'" + 'banana' + "'" + ' + ' + salt + ' = ' + saltedHash);

var salt2 = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
console.log('Randomly generated Salt 2 = ' + salt2);
var saltedHash2 = crypto.createHash('md5').update('banana' + salt2).digest('hex');
console.log('hashing ' + "'" + 'banana' + "'" + ' + ' + salt2 + ' = ' + saltedHash2);

console.log('saltedHash1 == saltedHash2');
console.log(saltedHash==saltedHash2);

console.log(crypto.createHash('md5').update('banana' + '59tuxqau4y433zwtstenux').digest('hex'));
