import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password
      });
      setMsg("Account created successfully!");
    } catch (err) {
      setMsg(err.response?.data?.error || "Failed to register");
    }
  };

  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <h2>Create Account</h2>

      <input 
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input 
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button 
        onClick={handleRegister}
        style={{ padding: "10px 20px", width: "100%", background: "#4caf50", color: "white" }}
      >
        Sign Up
      </button>

      {msg && <p style={{ marginTop: "10px" }}>{msg}</p>}
    </div>
  );
}
