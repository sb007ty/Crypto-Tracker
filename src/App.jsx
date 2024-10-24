import { useEffect, useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [inpVal, setInpVal] = useState("");

  const getCryptoData = async () => {
    try {
      const res = await fetch("https://api.coinlore.net/api/tickers/");
      if (!res.ok) throw new Error("Error loading api");
      const respData = await res.json();
      setCryptoData(respData.data);
      setLoading(false);
    } catch (ex) {
      setLoading(true);
      console.log("error loading data");
    }
  };
  useEffect(() => {
    // const invId = setInterval(() => {

    // }, 10000);
    // return () => {
    //   clearInterval(invId);
    // };
    getCryptoData();
  }, []);
  const cryptoDropdowns = useMemo(() => {
    if (cryptoData.length == 0) return [];
    return cryptoData.map((item) => {
      return (
        <option key={item.id} value={item.nameid} data-id={item.id}>
          {item.name}
        </option>
      );
    });
  }, [cryptoData]);

  function getMessage() {
    console.log(inpVal, Number(inpVal), "bro");
    return `${selectedCrypto["name"]} has surprassed ${inpVal}$`;
  }
  const showAlert = useMemo(() => {
    if (!selectedCrypto || inpVal.length === 0 || isNaN(inpVal)) return false;
    return selectedCrypto["price_usd"] > Number(inpVal);
  }, [selectedCrypto, inpVal]);

  const priceMessage = `Price- ${
    selectedCrypto ? selectedCrypto["price_usd"] : ""
  } $`;

  return (
    <div className="card-container">
      <div className="card">
        <h1>Crypto Tracker</h1>

        <div className="sel-div">
          {loading && <p>Loading...</p>}
          {!loading && (
            <>
              <select
                name="crypto-values"
                id="crypto"
                onChange={(e) => {
                  const id = e.target.getAttribute("data-id");
                  console.dir(e.target);
                  const selecetdVal = e.target.value;
                  const newSelectedCrypto = cryptoData.find(
                    (item) => item.nameid === selecetdVal
                  );
                  setSelectedCrypto(newSelectedCrypto);
                  // console.log(newSelectedCrypto, " new");
                }}
                value={selectedCrypto?.["name-id"] && "none-sel"}
              >
                <option value="none-sel">Select a Crypto Currency</option>
                {cryptoDropdowns}
              </select>
              <p className="price-container">{priceMessage}</p>
            </>
          )}
        </div>
        <div className="inp-div">
          <input
            type="number"
            className="price-alert"
            onChange={(e) => {
              setInpVal(e.target.value);
            }}
            value={inpVal}
          />
        </div>
        {showAlert && <div className="alert-div">{getMessage()}</div>}
      </div>
    </div>
  );
}

export default App;
