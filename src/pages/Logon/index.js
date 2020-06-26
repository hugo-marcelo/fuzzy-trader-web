import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";

import "./styles.css";

import api from "../../services/api";

export default function Logon() {
  const [cpf, setCpf] = useState("");
  const history = useHistory();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const resp = await api.post("sessions", { cpf });

      const { id, name } = resp.data;

      localStorage.setItem("id", id);
      localStorage.setItem("cpf", cpf);
      localStorage.setItem("name", name);

      history.push("/profile");
    } catch (err) {
      alert("Falha no login, tente novamente");
    }
  }

  return (
    <div className="logon-container">
      <section className="form">
        <form onSubmit={(e) => handleLogin(e)}>
          <h1>Fuzzy Trader</h1>

          <input
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          <button className="button" type="submit">
            Entrar
          </button>
          <Link className="back-link" to="/register">
            <FiLogIn size={16} color="#7799ff" />
            &nbsp; Registrar
          </Link>
        </form>
      </section>
    </div>
  );
}
