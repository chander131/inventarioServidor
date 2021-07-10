import mongoose, { Types } from 'mongoose';

const Schema = mongoose.Schema;

const pedidoSchema = Schema({
    pedido: Array,
    total: Number,
    fecha: Date,
    cliente: Types.ObjectId,
    estado: String,
    vendedor: Types.ObjectId,
});

const Pedido = mongoose.model('Pedidos', pedidoSchema);

export default Pedido;
