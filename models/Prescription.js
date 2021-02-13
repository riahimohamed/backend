const mongoose = require('mongoose');
const { createdAt } = require('./preSave');
const Schema = mongoose.Schema;
const prescrModel = mongoose.Schema({
    date :{
        type : String,
        //default: Date.now()
    },
    description :{
        type : String

    },

});
module.exports=mongoose.model("prescrModel",prescrModel);
createdAt(prescrModel);