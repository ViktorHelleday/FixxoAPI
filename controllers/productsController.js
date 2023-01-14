const express = require('express')
const productSchema = require('../schemas/productSchema')
const controller = express.Router()


// Unsecured Routes
controller.route('/').get(async (req, res) => {
    const products = []
    const list = await productSchema.find()
    if(list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})


controller.route('/:tag').get(async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag })
    if(list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})


controller.route('/:tag/:take').get(async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag }).limit(req.params.take)
    if(list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})


controller.route('/product/details/:articleNumber').get(async (req, res) => {
    const product = await productSchema.findById(req.params.articleNumber)
    if(product) {
        res.status(200).json({
            articleNumber: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            tag: product.tag,
            imageName: product.imageName,
            rating: product.rating
        })
    } else
        res.status(404).json()
})




// Secured Routes
controller.route('/').post(async (req,res) => {
    const { name, description, price, category, tag, imageName, rating } = req.body

    if (!name || !price)
        res.status(400).json({text: 'Name and Price is required.'})

    const item_exists = await productSchema.findOne({name})
    if (item_exists)
        res.status(409).json({text: 'Product with the same name already exists.'})
    else {
        const product = await productSchema.create({
            name,
            description,
            price,
            category,
            tag,
            imageName,
            rating
        })
        if (product)
            res.status(201).json({text: `A product with article number ${product._id} was created successfully.`})
        else
            res.status(400).json({text: 'Something went wrong when trying to create the product.'})
    }
})

controller.route('/:articleNumber').delete(async (req,res) => {
    if(!req.params.articleNumber)
        res.status(400).json('No article number was specified.')
    else {
        const item = await productSchema.findById(req.params.articleNumber)
        if (item) {
            await productSchema.remove(item)
            res.status(200).json({text: `Product ${req.params.articleNumber} was deleted successfully.`})
        } else {
            res.status(404).json({text: `Product ${req.params.articleNumber} was not found.`})
        }
    }
})


controller.route('/product/details/:articleNumber').put(async (req, res) => {
    const { articleNumber, name, description, price, category, tag, imageName, rating } = req.body
    const updated = ({ articleNumber, name, description, price, category, tag, imageName, rating })

    const productCheck = productSchema.findById(req.params.articleNumber)
        if (productCheck) {
            const productUpdate = await productSchema.updateOne({_id: req.params.articleNumber}, updated)
                if (productUpdate) 
                    res.status(200).json({text: `Information about product ${req.params.articleNumber} was updated successfully.`})
                else 
                    res.status(400).json({text: 'The product was not updated.'})
        }
    return (updated)
})








module.exports = controller


