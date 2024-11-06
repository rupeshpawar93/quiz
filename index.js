'use strict'
import dotenv from 'dotenv'; 
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser'
import Routes from './src/routes/index.js'

import { constantVariables } from './src/utilties/index.js';
import { verifyToken } from './src/middlewares/auth.js';

const app = express();
const port = process.env.PORT ?? constantVariables.PORT;

// CORS Configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || constantVariables.ALLOW_CORS_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: constantVariables.ALLOW_CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    BODY_LIMIT: '100kb', // Adjust as needed
    allowedHeaders: 'Content-Type,Authorization',
};

// Middleware Initializations
app.use(cors(corsOptions))
app.use(compression());
app.use(bodyParser.json({ limit: constantVariables.BODY_LIMIT }))
app.use(bodyParser.urlencoded({ limit: constantVariables.BODY_LIMIT, extended: true }))
app.use(helmet())
app.use(verifyToken);


// Initialize Routes
Routes.init(app);

app.listen(port, () => {
    console.log(`backend service is running in port: ${port}`);
})
