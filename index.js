const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()

const WaitersApp = require("./waiter-function")
const waitersApp = WaitersApp()

const session = require('express-session')
const flash = require('express-flash')
const waiterFunction = require('./waiter-function')

app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.engine('handlebars', exphbs({ layoutsDir: "views/layouts/" }));
app.set('view engine', 'handlebars');

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", async function(req, res){
    res.render("index")
})
app.post("/", async function(req,res){
    var newWaiter = req.body.name
    await waitersApp.waiter(newWaiter)
    res.render("index")
})

app.get("/waiters", async function(req, res){
    const waiters= await waitersApp.getWaiters()
    res.render("waiters",{
        list:waiters
    })
})

app.get("/waiters/:user", async function(req, res){
    var user = req.params.user
    //console.log(user)
    res.render("waiter",{
        waiter: user
    })
})

app.post("/waiters/:user", async function(req, res){
    var user= req.params.user
    await waitersApp.selectedDay(user,"monday,tuesday,friday")
    res.render("waiter")
})

app.get("/days", async function(req, res){
await waitersApp.schedule()
res.render("days")
})

const PORT = process.env.PORT || 3091;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
})