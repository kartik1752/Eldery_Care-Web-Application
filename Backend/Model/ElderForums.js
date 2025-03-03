const { default: mongoose } = require("mongoose");

const ElderForumSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    forum:{
        type:String,
        required:true,
    }
    

});
module.exports=mongoose.model("ElderForums",ElderForumSchema);