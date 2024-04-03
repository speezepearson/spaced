import { httpRouter } from "convex/server";
import { httpCreate } from "./cards";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
    path: "/httpCreate",
    method: "POST",
    handler: httpCreate,
});

http.route({
    path: "/httpCreate",
    method: "OPTIONS",
    handler: httpAction(async (_, request) => {
        console.log('OPTIONS for httpCreate');
        // Make sure the necessary headers are present
        // for this to be a valid pre-flight request
        const headers = request.headers;
        if (
            headers.get("Origin") !== null &&
            headers.get("Access-Control-Request-Method") !== null &&
            headers.get("Access-Control-Request-Headers") !== null
        ) {
            console.log('yay good');
            return new Response(null, {
                headers: new Headers({
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST",
                    "Access-Control-Allow-Headers": "Content-Type, Digest",
                    "Access-Control-Max-Age": "86400",
                }),
            });
        } else {
            console.log('Invalid pre-flight request');
            return new Response();
        }
    }),
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;
