// const functions = require('firebase-functions');

const express = require('express');

const app = express();
const fs = require('fs');
const cors = require('cors');
app.use(cors({origin:"*"}));
app.use("/static",express.static(__dirname + '/public'));
// app.use(express.static("/public"));

app.get("/stream",(req,res)=>{
  console.log("Streaming...");
  const path = './public/sample.mp4';
  // const request = https.get('https://firebasestorage.googleapis.com/v0/b/react-app-live.appspot.com/o/sample.mp4?alt=media&token=7830155e-34d0-4151-9b47-997dc44f1774',function(response){
  //   response.pipe(response);
  // });
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if(range){
    const parts = range.replace(/bytes=/,"").split("-");
    const start = parseInt(parts[0],10);
    const end = parts[1]?parseInt(parts[1],10):fileSize-1;
    const chunkSize = (end-start)+1;
    const file = fs.createReadStream(path,{start,end});
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
    fs.createReadStream(path).pipe(res);
  }
});

const port= process.env.PORT || 4000;

app.listen(port,(req,res)=>{
  console.log("server is running of port "+port);
});
// const apps = require('./server/app');
// const app = apps.app;
// app.get('/timestamp',(req,res)=>{
//   res.send(`${Date.now()}`);
// });

// app.get('/timestamp-cached',(req,res)=>{
//   res.set('Cache-Control','public, max-age=300,s-maxage=600');
//   res.send(`${Date.now()}`);
// });
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// export let ssrapp = functions.https.onRequest(app);
