// const functions = require('firebase-functions');

// const express = require('express');

// const app = express();
const fs = require('fs');
// const cors = require('cors');
// const paths = require('path');
// app.set('view engine', 'ejs');
// app.set('views', paths.join(__dirname, './public'));
// app.use("/static",express.static(__dirname + '/public'));
// app.use(express.static("/public"));


// const port= process.env.PORT || 4000;

// app.listen(port,(req,res)=>{
//   console.log("server is running of port "+port);
// });

// app.get('*', (req, res) => {
//   res.render('index');
// });
const express = require('express'),
    path = require('path'),
    Session = require('express-session'),
    bodyParse = require('body-parser'),
    passport = require('./server/auth/passport'),
    mongoose = require('mongoose'),
    middleware = require('connect-ensure-login'),
    FileStore = require('session-file-store')(Session),
    config = require('./server/config/default'),
    flash = require('connect-flash'),
    port = config.server.port,
    app = express();
    // node_media_server = require('./server/media_server'),
    // thumbnail_generator = require('./server/cron/thumbnails');

// mongoose.connect('mongodb://VenkateshM:venkatesh123@ds129374.mlab.com:29374/customersapp' , { useNewUrlParser: true });
let uri = 'mongodb://venkateshm:venkatesh123@ds129374.mlab.com:29374/customersapp';
mongoose.connect(uri,{useNewUrlParser: true},(err)=>{
  if(err){
    console.log(`Error occured ${err}`);
  } else{
    console.log("MongoDB connected");
  }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './server/views'));
app.use(express.static('./public'));
app.use('/thumbnails', express.static('./server/thumbnails'));
app.use(flash());

app.use(require('cookie-parser')());
app.use(bodyParse.urlencoded({extended: true}));
app.use(bodyParse.json({extended: true}));

app.use(Session({
    store: new FileStore({
        path : './server/sessions'
    }),
    secret: config.server.secret,
    maxAge : Date().now + (60 * 1000 * 30),
    resave : true,
    saveUninitialized : false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Register app routes
app.use('/login', require('./server/routes/login'));
app.use('/register', require('./server/routes/register'));
app.use('/settings', require('./server/routes/settings'));
app.use('/streams', require('./server/routes/streams'));
app.use('/user', require('./server/routes/user'));

app.get('/logout', (req, res) => {
    req.logout();
    return res.redirect('/login');
});
// app.use(express.static('./public'));

app.get("/stream",(req,res)=>{
  console.log("Streaming...");
  const videoUrl = './public/sample.mp4';
  // const request = https.get('https://firebasestorage.googleapis.com/v0/b/react-app-live.appspot.com/o/sample.mp4?alt=media&token=7830155e-34d0-4151-9b47-997dc44f1774',function(response){
  //   response.pipe(response);
  // });
  const stat = fs.statSync(videoUrl);
  const fileSize = stat.size;
  const range = req.headers.range;
  if(range){
    const parts = range.replace(/bytes=/,"").split("-");
    const start = parseInt(parts[0],10);
    const end = parts[1]?parseInt(parts[1],10):fileSize-1;
    const chunkSize = (end-start)+1;
    const file = fs.createReadStream(videoUrl,{start,end});
    const head = {
      'Content-Range':`bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges':'bytes',
      'Content-Length':chunkSize,
      'Content-Type':"video/mp4"
    }
    res.writeHead(206,head);
    file.pipe(res);
  } else{
    const head = {
      'Content-Length':fileSize,
      'Content-Type':"video/mp4"
    }
    res.writeHead(200,head);
    fs.createReadStream(videoUrl).pipe(res);
  }
});
app.get("/getip",(req,res)=>{
  console.log("IP Address of host "+req.connection.remoteAddress);
  res.json({"ip":req.connection.remoteAddress});
});
app.get("/testing",(req,res)=>{
  res.send("testing success");
});
// app.get('*', middleware.ensureLoggedIn(), (req, res) => {
//     res.render('index');
// });

app.get('*', (req, res) => {
  res.render('index');
});

app.listen(port, (req,res) => {
  console.log(`App listening on ${port}!`);
});
// node_media_server.run();
// thumbnail_generator.start();

