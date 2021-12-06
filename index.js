const express = require('express');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');

const  app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://tiger:scotch@cluster0.yrmd4.mongodb.net/urlShortner?retryWrites=true&w=majority',{useNewUrlParser:true , useUnifiedTopology: true}).then(()=>{
    console.log("connected with mongodb atlas");
}).catch(err => console.log(err));

app.use(express.urlencoded({extended : "false"}));

app.use(express.json());

app.set('view engine','ejs');

app.get('/',async(req,res)=>{
    const shortUrls = await shortUrl.find();
    res.render('index',{ shortUrls : shortUrls });
//     res.status(200).json(shortUrls);
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

app.get('/delete/:id',async (req,res)=>{
    try{
        let result = await shortUrl.findByIdAndDelete({_id : req.params.id});
        console.log("deleted :"+ req.params.id)
    }
    catch(err){
        console.log("error ocuured")
        console.log(err)
    }
    res.redirect("/")
})

app.listen(port , ()=>{
    console.log(`listening at port ${port} `);
});


