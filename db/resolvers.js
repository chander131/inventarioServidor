import mongoose from 'mongoose';

import Cliente from '../models/cliente';
import Producto from '../models/productos';
import Pedido from '../models/pedido';
import Usuario from '../models/usuario';

const ObjectId = mongoose.Types.ObjectId;

import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });

import jwt from 'jsonwebtoken';

const crearToken = (user, secreto, expiresIn) => {
	const { usuario, nombre, rol } = user;

	return jwt.sign({ usuario, nombre, rol }, secreto, { expiresIn });
};

export const resolvers = {
	Query: {
		getClientes: (root, { limite, offset, vendedor }) => {
			let filtro;
			if (vendedor) filtro = { vendedor: new ObjectId(vendedor) };
			return Cliente.find(filtro).limit(limite).skip(offset);
		},
		getCliente: (root, { id }) => {
			return new Promise((resolve, object) => {
				Cliente.findById(id, (error, cliente) => {
					if (error) rejects(error);
					else resolve(cliente);
				});
			});
		},
		totalClientes: (root, { vendedor }) => {
			let filtro;
			if (vendedor) filtro = { vendedor: new ObjectId(vendedor) }
			return new Promise((resolve, object) => {
				Cliente.countDocuments(filtro, (error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},

		//#region Productos
		obtenerProductos: async (root, { limite, offset, stock }) => {
			let filtro = {};
			if (stock) filtro = { ...filtro, stock: { $gt: 0 } };
			return await Producto.find(filtro).limit(limite).skip(offset).sort({ _id: -1 });
		},
		obtenerProducto: (root, { id }) => {
			return new Promise((resolve, object) => {
				Producto.findById(id, (error, producto) => {
					if (error) rejects(error);
					else resolve(producto);
				});
			});
		},
		totalProductos: (root) => {
			return new Promise((resolve, object) => {
				Producto.countDocuments({}, (error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},
		//#endregion

		//#region Pedido
		obtenerPedidos: async (root, { cliente, vendedor }) => {
			try {
				let filtro = { cliente };
				if (vendedor) filtro = { ...filtro, vendedor: new ObjectId(vendedor) }
				const pedido = await Pedido.find(filtro);
				return pedido;
			} catch (e) { return e; }
		},
		topClientes: async (root) => {
			try {
				const top10 = await Pedido.aggregate([
					{
						$match: {
							estado: "COMPLETADO"
						}
					},
					{
						$group: {
							_id: "$cliente",
							total: { $sum: "$total" }
						}
					},
					{
						$lookup: {
							from: "clientes",
							localField: "_id",
							foreignField: "_id",
							as: "cliente"
						}
					},
					{
						$sort: { total: -1 }
					},
					{
						$limit: 10
					}
				]);
				return top10;
			} catch (e) {
				return e;
			}
		},
		topVendedores: async (root) => {
			try {
				const top10 = await Pedido.aggregate([
					{
						$match: {
							estado: "COMPLETADO"
						}
					},
					{
						$group: {
							_id: "$vendedor",
							total: { $sum: "$total" }
						}
					},
					{
						$lookup: {
							from: "usuarios",
							localField: "_id",
							foreignField: "_id",
							as: "vendedor"
						}
					},
					{
						$sort: { total: -1 }
					},
					{
						$limit: 10
					}
				]);
				return top10;
			} catch (e) {
				return e;
			}
		},
		//#endregion

		//#region Usuarios
		obtenerUsuario: async (root, args, context) => {
			try {
				const { usuario } = context;
				if (!usuario) return null;

				const usuarioDB = await Usuario.findOne({ usuario: usuario.usuario });
				return usuarioDB;
			} catch (e) {
				console.log(e);
				return null;
			}
		},
		//#endregion
	},
	Mutation: {
		crearCliente: (root, { input }) => {
			// const id = require('crypto').randomBytes(10).toString('hex');
			const nuevoCliente = new Cliente({
				nombre: input.nombre,
				apellido: input.apellido,
				empresa: input.empresa,
				emails: input.emails,
				edad: input.edad,
				tipo: input.tipo,
				vendedor: input.vendedor,
			});
			nuevoCliente.id = nuevoCliente._id;

			return new Promise((resolve, object) => {
				nuevoCliente.save((error) => {
					if (error) rejects(error);
					else resolve(nuevoCliente);
				});
			});
		},
		actualizarCliente: (root, { input }) => {
			return new Promise((resolve, object) => {
				Cliente.findOneAndUpdate(
					{ _id: input.id },
					input,
					{ new: true },
					(error, cliente) => {
						if (error) rejects(error);
						else resolve(cliente);
					}
				);
			});
		},
		eliminarCliente: (root, { id }) => {
			return new Promise((resolve, object) => {
				Cliente.findOneAndRemove({ _id: id }, (error) => {
					if (error) rejects(error);
					else resolve('El Cliente se elimino correctamente');
				});
			});
		},

		//#region Productos
		nuevoProducto: async (root, { input }) => {
			const nuevoProducto = new Producto({
				nombre: input.nombre,
				precio: input.precio,
				stock: input.stock,
			});
			nuevoProducto.id = nuevoProducto._id;

			try {
				await nuevoProducto.save();
				return nuevoProducto;
			} catch (e) { return e; }
		},
		actualizarProducto: async (root, { input }) => {
			try {
				const producto = await Producto.findOneAndUpdate({ _id: input.id }, input, { new: true });
				return producto;
			} catch (e) { return e; }
		},
		eliminarProducto: async (root, { id }) => {
			try {
				await Producto.findOneAndDelete({ _id: id });
				return "El Producto se elimino correctamente";
			} catch (e) { return e; }
		},
		//#endregion


		//#region Pedido
		nuevoPedido: async (root, { input }) => {
			const nuevoPedido = new Pedido({
				pedido: input.pedido,
				total: input.total,
				fecha: new Date(),
				cliente: input.cliente,
				estado: "PENDIENTE",
				vendedor: input.vendedor,
			});
			nuevoPedido.id = nuevoPedido._id;

			try {
				await nuevoPedido.save();
				return nuevoPedido;
			} catch (e) { return e; }
		},
		actualizarPedido: async (root, { input }) => {
			try {
				const { estado } = input;
				const instruccion = estado === 'COMPLETADO' ? '-' : estado === 'CANCELADO' && '+';
				// Actualiza la cantidad de los productos en base al estado del pedido
				input.pedido.forEach(pedido => {
					Producto.updateOne(
						{ _id: pedido.id },
						{
							"$inc": { "stock": `${instruccion}${pedido.cantidad}` }
						},
						(error) => {
							if (error) return new Error(error);
						}
					);
				});

				const pedido = await Pedido.findOneAndUpdate({ _id: input.id }, input, { new: true });

				return pedido;
			} catch (e) { return e; }
		},
		eliminarPedido: async (root, { id }) => {
			try {
				await Pedido.findOneAndDelete({ _id: id });
				return "El Pedido se elimino correctamente";
			} catch (e) { return e; }
		},
		//#endregion


		//#region Usuarios
		nuevoUsuario: async (root, { usuario, nombre, password, rol }) => {
			try {
				const usuarioExiste = await Usuario.findOne({ usuario });

				if (usuarioExiste) throw new Error('El usuario ya existe');

				await new Usuario({
					usuario,
					nombre,
					password,
					rol,
				}).save();

				return "Usuario creado correctamente";
			} catch (e) {
				return e;
			}
		},
		autenticarUsuario: async (root, { usuario, password }) => {
			try {
				const usuarioDB = await Usuario.findOne({ usuario });

				if (!usuarioDB) throw new Error('Usuario no encontrado');

				const passwordCorrecto = await bcrypt.compare(password, usuarioDB.password);

				if (!passwordCorrecto) throw new Error('Usuario o contraseña incorrecto');

				return {
					token: crearToken(usuarioDB, process.env.SECRETO, '1hr'),
				};
			} catch (e) {
				return e;
			}
		},
		//#endregion
	},
};
