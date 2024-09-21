const express = require('express');
const session = require('express-session');
const userRouter = require('./routers/user.router');
const genreRouter = require('./routers/genre.router');
const comicRouter = require('./routers/comic.router');
const chapterRouter = require('./routers/chapter.router');
const favoriteRouter = require('./routers/favorite.router');
const commentRouter = require('./routers/comment.router');
const port = process.env.PORT;
require('./configs/connect.db')

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(session({
    secret: 'read_comic', // Thay đổi thành khóa bí mật của bạn
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Nếu bạn sử dụng HTTPS, hãy đặt secure: true
}));
//Use router
app.use('/users',userRouter);
app.use('/genres',genreRouter);
app.use('/comics',comicRouter);
app.use('/chapter',chapterRouter);
app.use('/favorite',favoriteRouter);
app.use('/comments',commentRouter);
app.listen(port , ()=>{
    console.log(`Server running  on port ${port}`);

})