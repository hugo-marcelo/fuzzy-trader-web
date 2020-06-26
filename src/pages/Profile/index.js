import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import { FiPower } from "react-icons/fi";
import { FaMoneyBill } from "react-icons/fa";

import "./styles.css";
import api from "../../services/api";
import investimentApi from "../../services/investment-api";

export default function Profile() {
  const history = useHistory();

  const [portfolio, setPortfolio] = useState([]);
  const [assets, setAssets] = useState([]);
  const [amountToInvest, setAmountToInvest] = useState("");
  const [analysisStarted, setAnalysisStarted] = useState(false);

  const id = localStorage.getItem("id");
  const cpf = localStorage.getItem("cpf");
  const name = localStorage.getItem("name");

  useEffect(() => {
    api.get(`portfolios/${id}`).then((res) => setPortfolio(res.data));

    api.get("assets").then(async (res) => {
      const assets = res.data.map((asset) => {
        if (asset.type === "crypto") {
          investimentApi
            .getCurrencyValue(asset.code)
            .then((res) => (asset.value = res));
        } else {
          investimentApi
            .getStockValue(asset.code)
            .then((res) => (asset.value = res));
        }
        return asset;
      });
      setAssets(assets);
    });
  }, [id, cpf]);

  async function handleInvestiment(e) {
    e.preventDefault();
    setAnalysisStarted(true);
  }

  async function handleDeletePortfolio(id) {
    try {
      await api.delete(`portfolios/${id}`);

      setPortfolio(portfolio.filter((item) => item.id !== id));
    } catch (err) {
      alert("Não foi possível completar a operação de venda, tente novamente.");
    }
  }

  async function handleSavePortfolio(assetId, amount) {
    try {
      let assetExists = false;
      let portfolioAmout = 0;
      let portfolioId = null;

      portfolio.forEach((item) => {
        if (item.assetId === assetId) {
          assetExists = true;
          portfolioAmout = item.amount;
          portfolioId = item.id;
        }
      });

      if (assetExists) {
        await api.put(`portfolios/${portfolioId}`, {
          amount: parseInt(portfolioAmout) + parseInt(amount),
        });
      } else {
        await api.post("portfolios", {
          userId: localStorage.getItem("id"),
          assetId: assetId,
          amount: parseInt(portfolioAmout) + parseInt(amount),
        });
      }

      api.get(`portfolios/${localStorage.getItem("id")}`).then((res) => {
        setPortfolio(res.data);
      });

      setAmountToInvest("");
      setAnalysisStarted(0);
    } catch (err) {
      alert("Erro ao salvar, tente novamente.");
    }
  }

  function handleLogout() {
    localStorage.clear();
    history.push("/");
  }

  return (
    <div className="profile-container">
      <header>
        <span>Bem vindo(a), {name}!</span>

        <button type="button" onClick={() => handleLogout()}>
          <FiPower size={18} color="#7799ff" />
        </button>
      </header>

      <h1>Quanto deseja investir hoje?</h1>
      <form onSubmit={handleInvestiment} className="investment">
        <input
          placeholder="Valor em USD"
          value={amountToInvest}
          onChange={(e) => setAmountToInvest(e.target.value)}
        />

        <button className="button" type="submit">
          Analisar
        </button>
      </form>

      <ul>
        {!!amountToInvest &&
          !!analysisStarted &&
          assets.map((item) => {
            if (Math.floor(amountToInvest / (!!item.value ? item.value : 1))) {
              return (
                <li key={item.id}>
                  <strong>
                    {item.type === "crypto" ? "CRIPTOMOEDA" : "AÇÃO"}:
                  </strong>
                  <p>
                    {item.code} ({item.name})
                  </p>

                  <strong>VALOR:</strong>
                  <p>
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(item.value)}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleSavePortfolio(
                        item.id,
                        Math.floor(
                          amountToInvest / (!!item.value ? item.value : 1)
                        )
                      )
                    }
                  >
                    <FaMoneyBill size={20} color="green" /> <br /> Comprar x
                    {Math.floor(
                      amountToInvest / (!!item.value ? item.value : 1)
                    )}
                  </button>
                </li>
              );
            } else {
              return "";
            }
          })}
      </ul>

      <h2>
        Minha Carteira
        <span>
          Total:{"  "}
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(
            portfolio.reduce(
              (acc, cur) =>
                parseFloat(acc) +
                parseFloat(cur.amount * localStorage.getItem(cur.code)),
              0
            )
          )}
        </span>
      </h2>
      <ul>
        {portfolio.map((item) => (
          <li key={item.id}>
            <strong>{item.type === "crypto" ? "CRIPTOMOEDA" : "AÇÃO"}:</strong>
            <p>
              {item.code} ({item.name})
            </p>

            <strong>QUANTIDADE:</strong>
            <p>{item.amount}</p>

            <strong>VALOR TOTAL:</strong>
            <p>
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(item.amount * localStorage.getItem(item.code))}
            </p>

            <button
              type="button"
              onClick={() => handleDeletePortfolio(item.id)}
            >
              <FaMoneyBill size={20} color="green" /> <br /> Vender
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
