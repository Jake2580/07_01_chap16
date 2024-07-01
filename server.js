const dotenv = require("dotenv").config();
const setup = require("./db_setup");
const express = require("express");

const app = express();

app.use(express.static("public")); //static 미들웨어 설정

// session 설정
const session = require("express-session");
app.use(
  session({
    secret: process.env.WEB_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());


// body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));


// 라우팅 
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get('/search', async function(req, res) {
  const { mongodb } = await setup();
  mongodb.collection('post').find({ title: req.query.value }).toArray().then((result) => {
    result.forEach((item) => {
      if (item.path != undefined) {
        item.path = item.path.replace('public/', '');
      }
    });
    res.render('post/sresult.ejs', { data: result });
  });
});

// 라우팅 포함하는 코드
app.use('/', require('./routes/account.js')); 
app.use('/', require('./routes/post'));

app.listen(process.env.WEB_PORT, async () => {
  await setup();
  console.log("8080 서버가 준비되었습니다...");
});
