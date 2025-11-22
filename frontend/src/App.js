import React, { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import AssetTokenJSON from "./abis/AssetToken.json";

// IMPORTANT: replace with your real deployed token address if different
const TOKEN_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [balance, setBalance] = useState("0");
  const [networkName, setNetworkName] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const [busy, setBusy] = useState(false);

  // form state
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const isConnected = !!signer && !!address;

  // read-only contract (uses provider)
  const tokenRead = useMemo(() => {
    if (!provider) return null;
    return new ethers.Contract(TOKEN_ADDR, AssetTokenJSON.abi, provider);
  }, [provider]);

  // write-enabled contract (uses signer)
  const tokenWrite = useMemo(() => {
    if (!signer) return null;
    return new ethers.Contract(TOKEN_ADDR, AssetTokenJSON.abi, signer);
  }, [signer]);

  const shortAddr = (a) => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "");
  const clearToast = () => setTxStatus("");

  // 🔌 Connect wallet (MetaMask)
  async function connect() {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const p = new ethers.BrowserProvider(window.ethereum);
      await p.send("eth_requestAccounts", []);
      const s = await p.getSigner();

      setProvider(p);
      setSigner(s);

      const addr = await s.getAddress();
      setAddress(addr);

      const net = await p.getNetwork();
      setNetworkName(net && net.name ? net.name : "Unknown");

      setTxStatus(`✅ Wallet connected: ${addr}`);
    } catch (err) {
      setTxStatus("❌ Connect error: " + (err?.message || String(err)));
    }
  }

  // 📊 Load token decimals + your balance
  async function loadTokenInfo() {
    try {
      if (!tokenRead || !address) return;
      const dec = await tokenRead.decimals();
      setTokenDecimals(Number(dec));
      const bal = await tokenRead.balanceOf(address);
      setBalance(ethers.formatUnits(bal, Number(dec)));
    } catch (err) {
      console.warn("loadTokenInfo error:", err);
    }
  }

  // Reload signer & network when account changes in MetaMask
  useEffect(() => {
    if (window.ethereum) {
      const onAccountsChanged = async () => {
        try {
          const p = new ethers.BrowserProvider(window.ethereum);
          const s = await p.getSigner();
          setProvider(p);
          setSigner(s);

          const addr = await s.getAddress();
          setAddress(addr);

          const net = await p.getNetwork();
          setNetworkName(net && net.name ? net.name : "Unknown");

          setTxStatus(`🔄 Account changed: ${addr}`);
        } catch (e) {
          console.warn(e);
        }
      };

      const onChainChanged = () => window.location.reload();

      window.ethereum.on &&
        window.ethereum.on("accountsChanged", onAccountsChanged);
      window.ethereum.on &&
        window.ethereum.on("chainChanged", onChainChanged);

      return () => {
        window.ethereum.removeListener &&
          window.ethereum.removeListener("accountsChanged", onAccountsChanged);
        window.ethereum.removeListener &&
          window.ethereum.removeListener("chainChanged", onChainChanged);
      };
    }
  }, []);

  // Load balance when connected or tokenRead changes
  useEffect(() => {
    if (isConnected) loadTokenInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, tokenRead]);

  // 💸 Transfer tokens
  async function transferTokens() {
    try {
      setTxStatus("");
      if (!signer || !tokenWrite) {
        setTxStatus("❌ Connect your wallet first.");
        return;
      }

      const toTrimmed = String(to || "").trim();
      const amtTrimmed = String(amount || "").trim();

      if (!toTrimmed || !amtTrimmed) {
        setTxStatus("❌ Please enter receiver address and amount.");
        return;
      }

      if (!ethers.isAddress(toTrimmed)) {
        setTxStatus("❌ Invalid Ethereum address.");
        return;
      }

      let parsed;
      try {
        parsed = ethers.parseUnits(amtTrimmed, tokenDecimals);
      } catch (e) {
        setTxStatus("❌ Invalid amount: " + (e?.message || String(e)));
        return;
      }

      setBusy(true);
      setTxStatus("⏳ Sending transaction...");

      const tx = await tokenWrite.transfer(toTrimmed, parsed);

      setTxStatus("⛓️ Waiting for confirmation...");
      const receipt = await tx.wait();

      setTxStatus(
        `✅ Success! Sent ${amtTrimmed} tokens to ${shortAddr(
          toTrimmed
        )}\nTx Hash: ${receipt?.hash || tx.hash}`
      );

      await loadTokenInfo();
      setAmount("");
    } catch (err) {
      const message = err?.data?.message || err?.message || String(err);
      setTxStatus("❌ Error: " + message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-wrap">
      <div className="bg-anim" />

      {/* Top nav */}
      <header className="nav">
        <div className="brand">
          <span className="logo-dot" />
          <span className="brand-text">Asset Transfer</span>
        </div>

        <div className="nav-right">
          {networkName && (
            <div className="pill pill-net" title="Network">
              <span className="dot" /> {networkName}
            </div>
          )}
          {isConnected ? (
            <div className="pill pill-addr" title={address}>
              {shortAddr(address)}
            </div>
          ) : (
            <button className="btn neon" onClick={connect}>
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container">
        {/* Transfer card */}
        <section className="card glass">
          <div className="card-head">
            <div>
              <h2>Transfer Tokens</h2>
              <p style={{ margin: 0, color: "#a4abbe", fontSize: "0.9rem" }}>
                Send your ERC-20 asset tokens to another address.
              </p>
            </div>

            <div className="token-meta">
              <div className="meta-row">
                <span className="meta-label">Token</span>
                <span className="mono">{shortAddr(TOKEN_ADDR)}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Decimals</span>
                <span className="mono">{tokenDecimals}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Your Balance</span>
                <span className="mono">{balance}</span>
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Receiver Address</label>
              <input
                className="input"
                placeholder="0xABC...1234"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                spellCheck={false}
              />
            </div>

            <div className="field">
              <label>Amount</label>
              <input
                className="input"
                placeholder="e.g. 10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
              />
            </div>

            <div className="actions">
              <button
                className={`btn primary ${busy ? "busy" : ""}`}
                onClick={transferTokens}
                disabled={busy}
              >
                {busy ? "Processing..." : "Send Tokens"}
              </button>
              {!isConnected && (
                <button className="btn soft" onClick={connect}>
                  Connect First
                </button>
              )}
            </div>
          </div>

          {txStatus && (
            <div
              className={`toast ${
                txStatus.startsWith("✅")
                  ? "ok"
                  : txStatus.startsWith("⏳") || txStatus.startsWith("⛓️")
                  ? "info"
                  : "err"
              }`}
              onClick={clearToast}
            >
              {txStatus}
            </div>
          )}
        </section>

        {/* Tips card */}
        <section className="card glass subtle">
          <h3>Tips</h3>
          <ul className="tips">
            <li>Make sure you're on the correct network (Localhost / Sepolia).</li>
            <li>
              Use the account that actually holds the tokens (usually the
              deployer or one you distributed tokens to).
            </li>
            <li>
              Click the toast message to dismiss it. Changing accounts in
              MetaMask will refresh the balance.
            </li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="foot">
        <span>⚡ Web3 UI • Dark Neon Theme</span>
      </footer>
    </div>
  );
}

export default App;
