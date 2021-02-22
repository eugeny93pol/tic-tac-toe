const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const path = require('path')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)


const PORT = process.env.PORT || config.get('port')

app.use(express.json({ extended: true}))

app.use('/api/games', require('./routes/games.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', ((req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    }))
}

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        http.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
        require('./socket/connection.socket')(io)
    } catch (e) {
        console.log('Server error')
        process.exit(-1)
    }
} start()





