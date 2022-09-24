import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productosSchema = Schema({
    nombre: String,
    precio: Number,
    stock: Number,
});

const Productos = model('Productos', productosSchema);

export default Productos;
