const {Schema, model} = require('mongoose')

const schema = new Schema({
    title: {type: String, required: true},
    creator: {type: String, required: true},
    tags: [String],
    available: {type: Boolean, default: true}
})

module.exports = model('Game', schema)