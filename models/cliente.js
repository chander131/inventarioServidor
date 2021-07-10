import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const clienteSchema = Schema({
	nombre: String,
	apellido: String,
	empresa: String,
	emails: Array,
	edad: Number,
	tipo: String,
	vendedor: mongoose.Types.ObjectId
});

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;
