const { default: mongoose } = require("mongoose");

const TrackActivitySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    stepCount:{
        type:String,
        required:true,

    },
    sleepHours:{
        type:String,
        required:true,
    },
    yogaTime:{
        type:String,
        required:true,
    }

});
module.exports=mongoose.model("TrackActivity",TrackActivitySchema);  