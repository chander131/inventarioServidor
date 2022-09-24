import mongoose from 'mongoose';

const { Schema, Types, model } = mongoose;

const clienteSchema = Schema({
	nombre: String,
	apellido: String,
	empresa: String,
	emails: Array,
	edad: Number,
	tipo: String,
	vendedor: Types.ObjectId
});

const Cliente = model('Cliente', clienteSchema);

export default Cliente;
