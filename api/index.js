require("dotenv").config();

var mongoose = require("mongoose");

var mongoDB = process.env.DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true });

var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

var createApp = require("./api");

const port = process.env.API_PORT || 3200;

createApp(db).listen(port, () => {
  console.log(`running at port ${port}`);
});

var seedDb = require("./seedDb");

if (process.env.DEMO_MODE) {
  console.log("process.env.DEMO_MODE ", process.env.DEMO_MODE);
  seedDb();
}
