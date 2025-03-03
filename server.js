const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const Restaurant = require('./restaurantSchema.js')
require('dotenv').config();
const app=express();
app.use(cors());
app.use(express.json());
const port=process.env.PORT||3256

const db=async()=>{
    await mongoose.connect(process.env.DB_URL)
    console.log(connected);
}

app.get('/info',(req,res)=>{
    res.status(200).send('hello world')
})

app.post('/restaurants',async(req,res)=>{
    const{name,description,price,menu}=req.body;
    if(!name ){
        return res.status(400).json({error:"validation failed:name is required"})
    }
    else if(!price){
        return res.status(400).json({error:"validation failed:price is required"})
    }
    else if(!menu){
        return res.status(400).json({error:"validation failed:menu is required"})
    };
    try{
        const restaurant=new Restaurant({
            name,
            description,
            price,
            menu
        });
        await restaurant.save();
        res.status(201).json(restaurant);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
})

app.get('/restaurants',async(req,res)=>{
    try{
        const restaurants=await Restaurant.find();
        res.status(200).jsone(restaurants);
    }
    catch(err){
        console.error(err)
        res.status(500).json({error:'failed to fetch restaurants'});
    }
});

app.get('/restaurants/:id',async(req,res)=>{
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid restaurant ID' });
    }

    try {
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.status(200).json(restaurant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch restaurant' });
    }
});
app.put('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, menu } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'restaurant not found' });
    }

    try {
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        
        restaurant.name = name || restaurant.name;
        restaurant.description = description || restaurant.description;
        restaurant.price = price || restaurant.price;
        restaurant.menu = menu || restaurant.menu;

        await restaurant.save();
        res.status(200).json(restaurant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update restaurant' });
    }
});

app.delete('/restaurants/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Restaurant not found' });
    }

    try {
        const restaurant = await Restaurant.findByIdAndDelete(id);

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete restaurant' });
    }
});









app.listen(port,()=>{
    console.log(`server connected successfully at ${port}`);
})



















































