const { default: mongoose } = require("mongoose");

const FamilySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    }

});
module.exports=mongoose.model("Family",FamilySchema);