const {Router} = require('express')
const router = Router()
const Game = require('../models/Game')
const Tag = require('../models/Tag')

router.get('/tags', async (req, res) => {
    try {
        const data = await Tag.find()
        res.status(200).json(data)
    } catch (e) {
        return res.status(500).json('Server internal error. Try again.')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id)
        res.status(200).json(game)
    } catch (e) {
        return res.status(500).json('Server internal error. Try again.')
    }
})

router.post('/create', async (req, res) => {
    try {
        const {title, creator, tags} = req.body

        const game = new Game({
            title, creator, tags
        })
        await game.save()

        for (const name of tags) {
            let tag = await Tag.findOne({name})
            if (tag) {
                tag.count = tag.count + 1
                await tag.save()
            } else {
                tag = new Tag({name})
                await tag.save()
            }
        }
        res.status(201).json(game)
    } catch (e) {
        return res.status(500).json('Server internal error. Try again.')
    }
})

router.post('/join', async(req, res) => {
    try {
        const {gameId} = req.body
        const game = await Game.findById(gameId) //from request
        if (game.available) {
            game.available = false
            game.save()
        }
        res.status(200).json({available: game.available})
    } catch (e) {
        res.status(500).json('Server internal error. Try again.')
    }
})

module.exports = router