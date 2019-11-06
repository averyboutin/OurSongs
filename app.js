const port = 3000;
const path = require('path');
var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + '/css')));
app.use(express.urlencoded({extended: false}));
app.get('/', (req,res)=>{
    res.render('index');
});

app.get('/login', (req,res)=>{
    res.render('login');
});


app.post('/login', function(req, res){
    var result = req.body.username + ' ' + req.body.password;
    res.send(result + ' sent');
});

app.listen(port, () => {
    console.log(`Server running on Port:${port}/`);
});

app.use((req,res) => {
    res.status(404).render('404');
})