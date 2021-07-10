import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });

import { typeDefs } from './db/schema';
import { resolvers } from './db/resolvers';

const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const token = req.headers["authorization"];

        if (token !== "null") {
            try {
                const usuario = await jwt.verify(token, process.env.SECRETO);
                req.usuario = usuario;
                return { usuario };
            } catch (e) {
                console.log(e);
            }
        }
    },
});

server.applyMiddleware({ app });

export { server };
export default app;
