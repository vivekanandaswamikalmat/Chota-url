const express = require('express');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');

const  app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://tiger:scotch@cluster0.yrmd4.mongodb.net/urlShortner?retryWrites=true&w=majority',{useNewUrlParser:true , useUnifiedTopology: true}).then(()=>{
    console.log("connected with mongodb atlas");
}).catch(err => console.log(err));

app.use(express.urlencoded({extended : "false"}));

app.set('view engine','ejs');

app.get('/',async(req,res)=>{
    const shortUrls = await shortUrl.find();
    res.render('index',{ shortUrls : shortUrls });
})

app.post('/shortUrl',async (req,res)=>{
    await shortUrl.create({full : req.body.fullurl});
    res.redirect('/');
})

app.get('/:short',async (req,res)=>{
    const shorturl = await shortUrl.findOne({short : req.params.short});
    if(shorturl == null) return res.sendStatus(404);
    shorturl.clicks++;
    shorturl.save();
    res.redirect(shorturl.full);

})

app.listen(port , ()=>{
    console.log(`listening at port ${port} `);
});
