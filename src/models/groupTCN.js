const mongoose = require('mongoose')

const gObject = new mongoose.Schema({
    Group:{type:String},
    Members:[Object]
})

const sObject = new mongoose.Schema({
    GroupingUri:{type:String},
    Value:{type:Number},
    Rank:{type:Number},
    SolutionOf:{type:String},
    Members:[gObject]
})

const groupTCN = mongoose.model('groupTCN', {
    LCCUri:{type:String},
    hasId:{type:String},
    DedicatedAgent:{type:String},
    Status:{type:String},
    Solutions:[sObject]
})

module.exports = groupTCN