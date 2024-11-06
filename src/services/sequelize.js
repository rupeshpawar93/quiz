
import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
// Initialize all models
import { User } from '../models/index.js';

config();
const __dirname = process.cwd();
const sequelize = new Sequelize({
    dialect: 'mysql',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
});

const UserModel = User(sequelize, Sequelize.DataTypes);

sequelize.authenticate().then(async (db) => {
    console.log('Connection has been established successfully.');
    // Synchronize the model with the database
    await sequelize.sync({ alter: true })
    console.log('Models synced with database');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});


export { sequelize, UserModel };

