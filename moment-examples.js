var moment = require('moment');

var now = moment();

console.log(now.format('MMM Do YYYY , h:mma') );
console.log(now.format('X') );
console.log(moment.utc(now.valueOf()).local().format('h:mm a'));