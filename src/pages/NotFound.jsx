import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="grid place-items-center py-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold">404</h1>
        <p className="text-slate-600">Page not found.</p>
        <Link to="/" className="underline">
          Go home
        </Link>
      </div>
    </div>
  );
}
