import { Link, Outlet } from "react-router-dom";

export function Root() {
    return <>
        <header>
            <div className="container"><Link to="/">Home</Link></div>
        </header>
        <main className="container">
            <Outlet />
        </main>
        <footer>
            {/* footer stuff */}
        </footer>
    </>
}