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

User.addHook('beforeValidate', (user) => {
  if(!user.imageUrl){
    user.imageUrl = `https://robohash.org/${user.id}.png?bgset=bg2`
  }
})

const syncAndSeed = async()=> {
  await conn.sync({ force: true });

  const [moe, lucy, larry] = await Promise.all([
    User.create({ username: 'moe', password: '123', email: 'moe@moe.com' }),
    User.create({ username: 'lucy', password: '123', email: 'lucy@lucy.com' }),
    User.create({ username: 'larry', password: '123', email: 'larry@larry.com'  }),
  ]);

  const [walletA, walletB, walletC, walletD, walletE, walletF, walletG] = await Promise.all([
    Wallet.create({ name: faker.company.catchPhraseAdjective() + ' ' + 'Wallet', userId: getRandom([moe, lucy, larry]).id }),
    Wallet.create({ name: faker.company.catchPhraseAdjective() + ' ' + 'Wallet', userId: getRandom([moe, lucy, larry]).id }),
    Wallet.create({ name: faker.company.catchPhraseAdjective() + ' ' + 'Wallet', userId: getRandom([moe, lucy, larry]).id }),
    Wallet.create({ name: faker.company.catchPhraseAdjective() + ' ' + 'Wallet', userId: getRandom([moe, lucy, larry]).id }),
    Wallet.create({ name: faker.company.catchPhraseAdjective() + ' ' + 'Wallet', userId: getRandom([moe, lucy, larry]).id }),
    Wallet.create({ name: faker.company.catchPhraseAdjective() + ' ' + 'Wallet', userId: getRandom([moe, lucy, larry]).id }),
    Wallet.create({ name: faker.company.catchPhraseAdjective() + ' ' + 'Wallet', userId: getRandom([moe, lucy, larry]).id }),
  ]);

  const fakeEntry = () => {
    const volume = faker.datatype.float({min: 10.0, max: 2000.0, precision: .01})
    const price = faker.datatype.float({min: 15800.0, max: 30890.0, precision: .01})
    const walletId = getRandom([walletA, walletB, walletC, walletD, walletE, walletF, walletG]).id
    
    return{
      volume,
      price,
      walletId
    }
  }

  await Promise.all(fakeEntries.map(async() => {
    await Entry.create({ volume, price, walletId } = fakeEntry())
  }))


  return {
    users: {
      moe,
      lucy,
      larry
    },
    wallets: {
      walletA,
      walletB,
      walletC,
      walletD,
      walletE,
      walletF,
      walletG
    }
  };
};


module.exports = {
  syncAndSeed,
  User,
  Wallet,
  Entry
};
