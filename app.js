const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const port = 3000;
app.set("view engine","ejs");
app.use(express.static("public"));  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/blog", {useNewUrlParser: true});

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    post:String,
    created:{type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"My Desk setup",
//     image:"https://farm9.staticflickr.com/8353/8290570661_eddbbc4bb6.jpg",
//     post:"This is my new desk setup"
// },function(err,blog){
//     if(err){
//       console.log(err);
//     }else{
//       console.log(blog);
//     }
// });

app.get("/",function(req,res){
    res.redirect("/blog");
});

app.get("/blog",function(req,res){
    Blog.find({},function(err,blog){
        if(err){
          console.log(err);
          res.send("Some error Occured");
        }else{
          res.render("index",{blog:blog});
        }
    });
});

app.get("/blog/new",function(req,res){
    res.render("new");
});

app.post("/blog",function(req,res){
    Blog.create(req.body.blog,function(err,blog){
        if(err){
          console.log(err);
        }
        else{
          res.redirect("/blog");
        }
    });
});

app.get("/blog/:id",function(req,res){
    var bid = req.params.id;
    Blog.findById(bid,function(err,blog){
       if(err){
         console.log(err);
       }else{
        res.render("show",{blog:blog});
       }
    });
});

app.get("/blog/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
      if(err){
        console.log(err);
      }else{
        res.render("edit",{blog:blog});
      }
    });
});

app.put("/blog/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,blog){
      if(err){
        console.log(err);
      }else{
        res.redirect("/blog/" + req.params.id);
      } 
    });
});

app.delete("/blog/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,blog){
       if(err){
         console.log(err);
       }
       else{
         res.redirect("/blog");
       }
    });
});

app.listen(port,function(){
  console.log("Blog App started");
});