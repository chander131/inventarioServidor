import mongoose from 'mongoose';
import bcryp from 'bcrypt';

const { Schema, model } = mongoose;

const usuarioSchema = Schema({
    usuario: String,
    nombre: String,
    password: String,
    rol: String,
});

// Hashear los password antes de guardarlos en la base de datos
usuarioSchema.pre('save', function (next) {
    // si el password no esta modificado ejecutar la siguiente funcion
    if (!this.isModified('password')) return next();

    bcryp.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcryp.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        });
    });
});

const Usuario = model('Usuario', usuarioSchema, 'usuarios');

export default Usuario;
