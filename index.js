const express = require('express');
const PORT = 2000;
const app = express();
const db = require('./models');
const akunrouter = require('./router/akunrouter');
const blogrouter = require('./router/blogrouter')

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(blogrouter)
app.use(akunrouter);

app.listen(PORT, ()=>{
  // db.sequelize.sync({ alter: true });
  console.log(`Server success running on port : ${PORT}`);
});
