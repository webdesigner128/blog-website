//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const homeStartingContent = "This blogging website is close to heart.It will be continuously updated as i gain more knowledge and also new features.happy coding";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();
mongoose.connect("mongodb+srv://shrikrishan10:krishan7@IIT@cluster0.9f7zj.mongodb.net/ejs-challenge", {
  useNewUrlParser: true
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
const blogSchemaLarge = new mongoose.Schema({
  title: String,
  content: String
})
const blogSchemaSmall = new mongoose.Schema({
  title: String,
  content: String
})
//blogsLarge and blogsSmall are collections name
const blogsLarge = mongoose.model("blogsLarge", blogSchemaLarge);
const blogsSmall = mongoose.model("blogsSmall", blogSchemaSmall);

const home = new blogsSmall({
  title: "Hello",
  content: homeStartingContent
})

const defaultitem = [home];

app.get("/", function(req, res) {
      blogsSmall.find({}, function(err, foundItems) {
        console.log(foundItems);
          if (err) {
            console.log("error");
          } else {
            if (foundItems.length === 0) {
              blogsSmall.insertMany(defaultitem, function(err) {
                if (err) {
                  console.log("error");
                } else {
                  console.log("Welcome on your first item");
                }
              });
              res.redirect("/");
            } else {
              res.render("home", {
                posts: foundItems
              });
            }
          }
      });
    });
   app.post("/delete",function(req,res)
    {
    // alert("this blog will be deleted");
     const id=req.body.checkBox;
     blogsSmall.findByIdAndRemove(id,function(err)
   {
     if(!err)
     {
       console.log("successful SMALL");
     }
   });
   blogsLarge.findByIdAndRemove(id,function(err)
    {
    if(!err)
  {
      console.log("successful LARGE");
    }
  });

     res.redirect("/");
   });
    app.get("/about", function(req, res) {

      res.render("about", {
        about: aboutContent
      });
    });
     app.get("/contact", function(req, res) {

      res.render("contact", {
        contact: contactContent
      });
    });
     app.get("/compose", function(req, res) {

      res.render("compose");
    });
    app.get("/posts/:index", function(req, res) {
      var index = req.params.index;
      blogsLarge.find({},function(err,result)
    {
      if(err)

      {
        console.log("error");
      }
      else {
      result.forEach(function(element) {
        if (_.lowerCase(index) == _.lowerCase(element.title)) {
          res.render("post", {
            obj:element
          });

        }
      });
    }
      });
    });

    app.post("/compose", function(req, res) {

      var post = new blogsLarge({
        title: req.body.title,
        content: req.body.content
      });
      post.save();
       //console.log(post);
      if (post.content.length > 100) {

        let smallstring = post.content.substr(0, 100);
        smallstring += "....";
        var smallpost = new blogsSmall({
          title: req.body.title,
          content: smallstring
        })
        smallpost.save();
      }
      else{
        var smallpost = new blogsSmall({
          title: req.body.title,
          content: req.body.content
        })
        smallpost.save();
      }
      res.redirect("/");

    })


    app.listen(process.env.PORT||3000, function() {
      console.log("Server started on port 3000");
    });
