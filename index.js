import mongoose from 'mongoose';
import app, { server } from './app';
import { API_VERSION, IP_SERVER, PORT_DB } from './config';
const port = process.env.PORT || 3977;

mongoose.set('useFindAndModify', false);

mongoose.connect(
	`mongodb://${IP_SERVER}:${PORT_DB}/clientes`,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err, res) => {
		if (err) {
			throw err;
		} else {
			console.log('La conexion a la base de datos es correcta');
			app.listen(port, () => {
				console.log('#####################');
				console.log('###### API REST #####');
				console.log('#####################');
				console.log(`${IP_SERVER}:${port}/api/${API_VERSION}`);
				console.log(`${IP_SERVER}:${port}${server.graphqlPath}`);
			});
		}
	}
);
