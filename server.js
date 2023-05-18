const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
require("./db/conn");
const userModel = require("./models/user.model");
const withdrawModel = require("./models/withdraw.model");
const purchaseModel = require("./models/purchase.model");
const historyModel = require("./models/history.model");


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "*"],
    methods: ["GET", "POST"],
    credentials: true
}))

app.use(express.json());
dotenv.config({ path: "config.env" });

const PORT = process.env.PORT || 3001;
app.use(require("./routers/register"));
app.use(require("./routers/login"));
app.use(require("./routers/purchase"));
app.use(require("./routers/beforePurchase"));
app.use(require("./routers/getUser"));
app.use(require("./routers/refer"));
app.use(require("./routers/withdraw"));

// setting up an empty GET Route
app.get('/', (req, res) => { res.json({ message: "You've come to the right place... it's a GET request!!" }) });

// Starting Server on PORT
app.listen(PORT, () => console.log('Server started on PORT Number: ' + PORT))