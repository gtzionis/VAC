const mongoose = require('mongoose');
//mongodb://mongo:27017/VAC_DB
mongoose.connect(process.env.DB_PRX || 'mongodb://localhost:27017/VAC_DB', { // process.env.DB_PRX
	//"user": "greg",
	//"pass": "!paokpaok4",
	//"useMongoClient":true,
    //useCreateIndex: true,
	"useNewUrlParser":true,
    "useUnifiedTopology": true
});
