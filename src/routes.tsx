import { createBrowserRouter } from "react-router-dom";
import { Root } from "./Root";
import * as Home from "./pages/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <Home.Page />,
            },
        ],
    },
]);
