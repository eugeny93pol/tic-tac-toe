const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    count: {type: Number, default: 1, required: true}
})

module.exports = model('Tag', schema)