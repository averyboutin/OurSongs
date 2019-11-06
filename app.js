const port = 80;
const path = require('path');
const sql = require('mssql');
const express = require('express');
const app = express();
const connPool = require('./db');
const crypto = require('crypto');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + '/css')));
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});


app.post('/login', async function (req, res) {
    console.log('Login attempted from IP ' + req.ip);
    try {
        console.log('entered ' + req.body.username + ' and ' + req.body.password);
        const connection = await connPool;
        const hashquery = await connection.request()
            .input('UserName', sql.NVarChar, req.body.username)
            .query('SELECT PasswordSalt FROM USERS WHERE UserName=@UserName', function (err, result) {
                if (err) console.log(err)
                if (result.rowsAffected != 1) {
                    res.send('incorrect login');
                }
                else {
                    var saltedHash = crypto.createHash('md5').update(req.body.password + result.recordset[0].PasswordSalt).digest('hex');
                    const passwordquery = connection.request()
                        .input('UserName', sql.NVarChar, req.body.username)
                        .input('PasswordHash', sql.NVarChar, saltedHash)
                        .query('SELECT * FROM USERS WHERE UserName=@UserName AND PasswordHash=@PasswordHash', function (err2, result2) {
                            if (err2) console.log(err2);
                            if (result2.rowsAffected != 1) {
                                res.send('incorrect login');
                            }
                            else {
                                res.render('index', {
                                    'uname' : req.body.username
                                });
                            }
                        });
                }
            });
    }
    catch (err) {
        res.status(500).send('err' + err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on Port:${port}/`);
});

app.use((req, res) => {
    res.status(404).render('404');
})