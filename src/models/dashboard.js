const mongoose = require('mongoose')

const fObject = new mongoose.Schema({
    bins:{type:String},
    category:{type:String},
    data:[String],
    keys:[String],
    name:{type:String},
    needed:[String],
    nums:[Number],
    numsNumerical:[[Number],[Number]],
    range:[Number],
    mode:{type:String},
    metric:{type:Boolean},
    transition:{type:Boolean},
    insideObj:{type:String},
    excel:{type:String}
})

const Dashboard = mongoose.model('Dashboard', {
        dash:
        [{ 
            chart:{type: String},
            column:{type: String},
            //dashName:{type: String},
            dashObj:[fObject],   
            id:{type:String},
            position:{type:Number}
        }],
        dashName:{type:String}
 })
 
 module.exports = Dashboard