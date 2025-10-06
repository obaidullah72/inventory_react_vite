import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthAPI } from "../lib/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await AuthAPI.register(name, email, password);
      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-6 shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Sign up</h1>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      <form onSubmit={onSubmit} className="grid gap-3">
        <input className="border rounded-lg px-3 py-2" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="border rounded-lg px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="border rounded-lg px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-60" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-3 text-sm">Already have an account? <Link to="/login" className="text-blue-700">Login</Link></p>
    </div>
  );
}


