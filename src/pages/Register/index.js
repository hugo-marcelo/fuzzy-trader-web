import React, { useState } from "react";

import api from "../../services/api";

import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./styles.css";

export default function Register() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");

  const history = useHistory();

  async function handleRegister(e) {
    e.preventDefault();
    const data = { name, cpf };

    try {
      await api.post("/users", data);
      history.push("/");
    } catch (err) {
      alert("Erro ao cadastrar");
    }
  }

  return (
    <div className="register-container">
      <div className="content">
        <section>
          <h1>Cadastro</h1>
          <p>Faça seu cadastro e planeje melhor seus investimentos.</p>
          <Link className="back-link" to="/">
            <FiArrowLeft size={16} color="#7799ff" />
            &nbsp;Voltar
          </Link>
        </section>

        <form onSubmit={handleRegister}>
          <input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="cpf"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />

          <button className="button" type="submit">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
