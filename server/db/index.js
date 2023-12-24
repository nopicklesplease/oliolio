const conn = require('./conn');
const User = require('./User');
const Wallet = require('./Wallet');
const Entry = require('./Entry');
const { faker } = require('@faker-js/faker');

User.hasMany(Wallet);
Wallet.belongsTo(User);
Wallet.hasMany(Entry);
Entry.belongsTo(Wallet);

const fakeEntries = new Array(100).fill('');

function getRandom(arr) {
  const randomIdx = Math.floor(Math.random() * arr.length);
  const thing = arr[randomIdx];
  return thing;
}

// User.addHook('beforeValidate', (user) => {
//   if(!user.imageUrl){
//     user.imageUrl = `https://robohash.org/${user.id}.png?bgset=bg2`
//   }
// })

const syncAndSeed = async()=> {
  await conn.sync({ force: false });
};


module.exports = {
  syncAndSeed,
  User,
  Wallet,
  Entry
};
