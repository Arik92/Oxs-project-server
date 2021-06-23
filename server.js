const port = process.env['PORT'] || '3000';
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user_routes.js');
const tenantRoutes = require('./routes/tenant_routes.js');
const auth = require('./auth.js')(); // passport defs

let mongo_connection_string_local = "mongodb://localhost:27017/oxs";
let mongo_connection_string = mongo_connection_string_local;
mongoose.Promise = global.Promise;
mongoose.connect(mongo_connection_string, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify:false,
  useNewUrlParser: true 
},
  function (err, db) {
    if (err) {
      console.error("Error connecting to mongo", err);
    } else {
      console.log("Connected to mongo");
    }
  });
  // MONGO CONNECT

const app = express();
app.use(auth.initialize()); // init passport auth middleware
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.urlencoded({extended: true,  limit: "50mb", parameterLimit: 500000000 }));
app.use(express.json({limit: '50mb'}));
app.use('/users', userRoutes);
app.use('/tenants', tenantRoutes);

//server config
app.listen(port, () => {
    console.log('OXS server is now listening on port ' + port);    
});
