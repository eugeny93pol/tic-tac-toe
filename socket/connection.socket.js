const Game = require('../models/Game')

const checkGameOver = (move, canvas) => {
    let row = move-move%3
    if (canvas[row]===canvas[row+1] &&
        canvas[row]===canvas[row+2]) return true
    let column = move%3
    if (canvas[column]===canvas[column+3] &&
        canvas[column]===canvas[column+6]) return true
    if (move%2!==0) return false
    if (move%4===0){
        if (canvas[0] === canvas[4] &&
            canvas[0] === canvas[8]) return true
        if (move!==4) return false
    }
    return canvas[2] === canvas[4] &&
        canvas[2] === canvas[6]
}

const checkDraw = (moves) => {
    let index = moves.findIndex(el => el < 0)
    return index < 0
}

const getGames = async () => {
    return Game.find({ available: true })
}

module.exports = (io) => {
    io.on('connection', async (socket) => {
        let canvas = []
        let id = ''

        socket.on('move', async (data) => {
            let moves = data.moves
            let move = data.move

            canvas = moves
            socket.emit('wait')
            socket.to(id).emit('updateMoves', canvas)

            if (checkGameOver(move, moves)) {
                socket.emit('win')
                socket.to(id).emit('lose')
            } else if (checkDraw(canvas)) {
                io.to(id).emit('draw')
            } else {
                socket.to(id).emit('doMove')
            }
        })

        socket.on('getGames', async () => {
            await socket.emit('GamesInOnline', await getGames())
        })

        socket.on('joinGame', async (gameId) => {
            const game = await Game.findById(gameId)

            if (game.available) {
                game.available = false
                await game.save()
                id = gameId

                socket.join(gameId)
                socket.emit('join', gameId)

                socket.emit('setZero', gameId)
                socket.to(id).emit('ready')

                await socket.broadcast.emit('GamesInOnline', await getGames())

            } else {
                socket.emit('gameEnds')
                await socket.emit('GamesInOnline', await getGames())
            }
        })

        socket.on('startGame', async (gameId) => {
            id = gameId
            socket.join(gameId)
            await socket.broadcast.emit('GamesInOnline', await getGames())
        })

        socket.on('disconnect', async () => {
            let games = await Game.find({creator: socket.id})
            games.map(async game => {
                game.available = false
                await game.save()
            })

            if (games.length) {
                await io.emit('GamesInOnline', await getGames())
            }
        })
    })
}
