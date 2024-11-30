const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

app.use(express.json())
app.use(cors())
dotenv.config()



// Sample in memory storage for todo items
//let todos = [];

// Connecting MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Database connected successfully!')
}).catch((err) => {
    console.log(err)
})

// Creating Schema
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String
})

// Creating Model
const todoModel = mongoose.model('Todo', todoSchema);

// Create a new todo item
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // }
    // todos.push(newTodo)
    // console.log(todos);
    try {
        const newTodo = new todoModel({ title, description })
        await newTodo.save()
        res.status(201).json(newTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
    
})

// Get all items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find()
        res.send(todos)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

// Update todo item
app.put('/todos/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(id, { title, description }, {new: true})
    
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" })
        }
        res.json(updatedTodo)
    } catch (error) {
        console.log(error)

    }
}
)

// Delete todo item
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
    
})


const port = process.env.PORT;

app.listen(port, () => {
    console.log('Server is listening at port', port);
})