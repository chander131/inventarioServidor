import mongoose from 'mongoose';
import { IP_SERVER, PORT_DB } from './config';

mongoose.set('useFindAndModify', false);

mongoose.connect(
	`mongodb://${IP_SERVER}:${PORT_DB}/clientes`,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err, res) => {
		if (err) {
			throw err;
		} else {
			console.log('La conexion a la base de datos es correcta');
		}
	}
);
