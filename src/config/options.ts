import dotEnv from "dotenv";
dotEnv.config();

/**
 * Contains all the server options for our application. This options wil be pass on to 
 * The new `Server(options) constructor` to define our server `properties and behaviour
 * 
 * @example 
 * ```ts 
 * const io = new Server(server, {
 *  ...serverOptions
 * });
 * ``` 
 * @see {@link server.ts for usage}
 */
export const serverOptions = {
    cors: {
        // origin: "http://localhost:4000",
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    }
}