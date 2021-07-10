import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productosSchema = Schema({
    nombre: String,
    precio: Number,
    stock: Number,
});

const Productos = mongoose.model('Productos', productosSchema);

export default Productos;