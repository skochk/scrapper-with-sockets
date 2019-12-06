var createError = require('http-errors');
var path = require('path');
const puppeteer = require('puppeteer');




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const port = 3001;
const express = require('express');
const app = express();
const server = app.listen(port, () => {
    console.log("Listening on port: " + port);
});
const io = require('socket.io')(server);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('socketio', io);
app.set('port', port);



app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function getArticle(){
  try{
      let pageNumber = getRandomInt(234);
      const url = `https://dou.ua/lenta/page/${pageNumber}/`
      const browser = await puppeteer.launch({headless: true});
      const page = await browser.newPage();
      await page.goto(url);
    
      let data = await page.evaluate(()=>{
          let title = document.querySelector(".title").innerText;
          let link =  document.querySelector(".title > a").href;
    
          return{
            title,
            link
          }
      });
      
      return data;
  }catch(err){
      console.log(err);
  }

};



io.on('connection', function (socket) {
  
  socket.on('start', data=>{
  console.log(data);
  setInterval(() => {
      getArticle().then((result)=>{
        console.log(result);
        socket.emit('news', { article: result });
      });

      

  }, 10000);


  });
});
module.exports = app;
