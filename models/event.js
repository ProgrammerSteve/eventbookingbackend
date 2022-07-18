const mongoose=require('mongoose');
const Schema = mongoose.Schema;
//_id automatically added with mongodb
//javascript doesn't have Float for type but it has a Date type
const eventSchema= new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});
//2 args, name of model/ A pointer to the Schema
module.exports=mongoose.model('Event',eventSchema);