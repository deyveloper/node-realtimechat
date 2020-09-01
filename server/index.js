const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')
const router = require('./router')
const { POINT_CONVERSION_COMPRESSED } = require('constants')
const { measureMemory } = require('vm')

// Environment variables
PORT = process.env.PORT || 5000

// Using
app.use(router)

// Add headers
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

var server = app.listen(PORT, () => console.log(`Server has started on port ${PORT}`))
const io = socketio(server)

io.on('connection', (socket) => {


    socket.on('join', ({name, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room })

        if (error) return callback(error)

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}.` })
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined.` })

        socket.join(user.room)

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('message', { user: user.name, text: message })
        
        callback()
    })

    socket.on('disconnect', () => {
        console.log('User had left!')
    })
})

