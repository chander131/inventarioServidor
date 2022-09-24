import mongoose from 'mongoose';

const { Schema, Types, model } = mongoose;

const pedidoSchema = Schema({
    pedido: Array,
    total: Number,
    fecha: Date,
    cliente: Types.ObjectId,
    estado: String,
    vendedor: Types.ObjectId,
});

const Pedido = model('Pedidos', pedidoSchema);

export default Pedido;
