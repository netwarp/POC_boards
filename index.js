const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('board', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres'
});

async function main() {
	try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
}

main()