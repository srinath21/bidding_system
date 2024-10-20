const port = 3000;
const express = require('express');
const cors = require('cors');
const app = express();

// allow requests with json body
app.use(express.json())

// currently allowing all origins
app.use(cors());

const routes = require('./routes/routes');

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require("./swagger.json");

// routes.use('/api-docs', swaggerUi.serve);
// routes.get('/api-docs', swaggerUi.setup(swaggerDocument));

app.use('/', routes);

app.get('/', (req, res) => {
    res.json({ status: 'API is running on /api' });
});

app.use((err, req, res, next) => {
    if (err && err.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: 'error',
            message: 'missing authorization credentials',
        });
    } else if (err && err.errorCode) {
        // @ts-ignore
        res.status(err.errorCode).json(err.message);
    } else if (err) {
        res.status(500).json(err.message);
    }
});

// start the server
app.listen(port, () => {
    console.log(`Server is running on port on ${port}`);
})