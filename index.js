const express = require('express');
const exphbs = require('express-handlebars')
const app = express();
const port = process.env.port || 5000
const path = require('path')
const body_parser = require('body-parser')

// use body parser middleware

app.use(body_parser.urlencoded({extended: false}))
// ==> handlebars

app.engine('handlebars',exphbs())
app.set('view engine','handlebars')

// ==> api
const request = require('request')

function call_api(finished_api,ticker){
    request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_498e65146b2141f3bd9c317d8fcbd0cc',{json:true},(err,res,body) =>{

        if (err) {
            return console.log(err)
        }
        if (res.statusCode === 200){
            return finished_api(body)
        }
    })
}
// ==> set handlebar index routes

app.get('/',function (req,res) {
    call_api(function (done_api) {
        res.render('home',{
            stock: done_api
        })
    },"fb")
})
// ==> set handlebar POST routes

app.post('/',function (req,res) {
    call_api(function (done_api) {
        res.render('home',{
            stock: done_api,
        })
    },req.body.stock_ticker)
})

// set a static folder
app.use(express.static(path.join(__dirname,'public')))


app.listen(port,() => console.log('Server listening on port ' + port))

