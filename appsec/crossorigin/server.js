const exp = require('express');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const _ = require('lodash');
const cors = require('cors');

const render = (body) => _.template("<html><body><%= body %></body></html>")({body});

const userdb = {
    's0': {id: 's0', pwd: 's0t0', salary: '30'},
    's1': {id: 's1', pwd: 's1t1', salary: '40'},
};

const app1 = exp();
app1.use(cookieParser());
const corsOptions = {
    origin: 'http://b.com:3001',
    credentials: true,
}
app1.use(cors(corsOptions));
//app1.use(bodyParser.json()); 
//app1.use(bodyParser.urlencoded({extended: true}));
const formParser = bodyParser.urlencoded({extended: true});
app1.use((req,res,next) => {
    if(req.path !== '/' 
        && req.path != '/rerror.js'
        && req.path !== '/login') {
        console.log(JSON.stringify(req.cookies));
        if (!req.cookies || !req.cookies.uid || req.cookies.uid.length <= 0
            || !userdb[req.cookies.uid]) {
            res.status(403).send('authentication required');
           return; 
        }
        req.user = userdb[req.cookies.uid];
    }
    next();
});
app1.get('/', (req,res) => res.send(render("<h1>Hello</h1>")));
app1.get('/login', (req,res) => res.send(render("<form method='post' action='/login'><input name='uid' ></input><input name='pwd'></input><input type='submit' value='login'></input></form>")));
app1.post('/login', formParser, (req,res) => {
    const user = userdb[req.body.uid];
    if(user && user.pwd === user.pwd) {
        res.cookie('uid', user.id).redirect('/home');
    } else
        res.status(403).send('forbidden');
});
app1.get('/home', (req, res) => res.send(render(_.template('<h1>welcome <%= uid%></h1>')({uid: req.user.id}))));
app1.get('/profile', (req,res) => res.send(render(_.template("Salary: <h2><%=user.salary%></h2>")({user:req.user}))));
app1.get('/profilejs', (req,res) => {res.type('.js');res.send(_.template("var salary = <%=user.salary%>;")({user:req.user}));});
app1.get('/rerror.js', (req,res) => {res.type('.js');res.send("throw new Error('some error');")});
app1.listen(3000, () => {});

const app2 = exp();
app2.get('/', (req,res) => {
    res.send(render("<script src='http://a.com:3000/profilejs' crossorigin='anonymous'></script>" +  
"<script src='/errorh.js'></script>" + 
"<script src='http://a.com:3000/rerror.js' ></script>" + 
"Salary<div id='salary'></div><script>document.getElementById('salary').innerHTML = salary;console.log('in b', x);</script>"));
});
app2.get('/errorh.js', (req,res) => {
    res.type('.js');
    res.send('window.onerror=(message, file, line, col, e) => {console.trace("Handlng error", e, JSON.stringify(e)); console.log(e.stack);}');
});
app2.listen(3001, () => {});
