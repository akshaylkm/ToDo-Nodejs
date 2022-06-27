const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); 
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB")

const itemSchema = {
    name : String
}

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
    name : "WORKOUT"
})
const item2 = new Item({
    name : "BUY FOOD"
})

const defaultItem = [item1,item2];



app.get("/",function(req,res){

Item.find({},function(err,foundItems){
    if (foundItems.length === 0){
   Item.insertMany(defaultItem,function(err){
    if (err){
        console.log(err);
    }else{
        console.log("succesfully added to database");
    }
     })
     res.redirect("/");
    }else{
        res.render("list",{kindOfDay:day,newListItems:foundItems});
    }
    
})

    let today = new Date();
    
    let options = {
        weekday : "long",
        day : "numeric",
        month : "long"
    }
    let day = today.toLocaleDateString("en-US",options);


})

app.post("/",function(req,res){
   let itemName = req.body.todoitem;
   const item = new Item({
    name : itemName
   })
   item.save();
   res.redirect("/")
})

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("successfully deleted checked item")
      }
      res.redirect("/")
    })
})


app.listen(process.env.PORT || 3000,function(){
   console.log("server started at 3000");
})