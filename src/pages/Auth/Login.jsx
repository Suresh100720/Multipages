import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await axios.post("http://localhost:5000/api/auth/login", form);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);

    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="mb-4 font-bold">Login</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;