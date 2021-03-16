//Modules
const express = require('express');
//Routers Path
const home = require('./routes/home');
const genre = require('./routes/genres');
//Middlewares Path
const log = require('./middleWares/logger')

//The Express App
const app = express();
//Middlewares
app.use(express.json());
app.use(log);
//Routers
app.use('/', home);
app.use('/api/genres', genre);

//PORT Listener
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`The app is listening to port ${port}`));