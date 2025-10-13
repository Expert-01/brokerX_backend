// routes/marketRoutes.js
import express from "express";
import axios from "axios";

const router = express.Router();

// Get candlestick data
router.get("/candles/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const { vs = "usd", days = 1 } = req.query;

    const coinMap = {
      BTCUSDT: "bitcoin",
      ETHUSDT: "ethereum",
      LTCUSDT: "litecoin",
      XRPUSDT: "ripple",
      BNBUSDT: "binancecoin",
      ADAUSDT: "cardano",
      DOGEUSDT: "dogecoin",
      SOLUSDT: "solana",
      DOTUSDT: "polkadot",
      MATICUSDT: "matic-network",
      // Add more mappings as needed
    };

    const coinId = coinMap[symbol];
    if (!coinId) {
      return res.status(400).json({ error: "Unsupported symbol" });
    }

    // Try Binance first
    try {
      const binanceData = await axios.get("https://api.binance.com/api/v3/klines", {
        params: {
          symbol,
          interval: "1m",
          limit: 30,
        },
      });
      const formattedData = binanceData.data.map((c) => ({
        time: c[0],
        open: parseFloat(c[1]),
        high: parseFloat(c[2]),
        low: parseFloat(c[3]),
        close: parseFloat(c[4]),
        volume: parseFloat(c[5]),
      }));
      return res.json({ source: "binance", data: formattedData });
    } catch (binanceError) {
      console.error("Error fetching Binance data:", binanceError.response?.data);
    }

    // Fallback to CoinGecko OHLC
    try {
      const coingeckoURL = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc`;
      const cgRes = await axios.get(coingeckoURL, {
        params: { vs_currency: vs, days: days },
      });

      // cgRes.data is [ [timestamp, open, high, low, close], ... ]
      const formattedData = cgRes.data.map((c) => ({
        time: c[0],
        open: parseFloat(c[1]),
        high: parseFloat(c[2]),
        low: parseFloat(c[3]),
        close: parseFloat(c[4]),
        volume: null, // CoinGecko OHLC does not provide volume
      }));

      return res.json({ source: "coingecko", data: formattedData });
    } catch (coingeckoError) {
      console.error("Error fetching CoinGecko data:", coingeckoError.response?.data);
    }

    // Try CryptoCompare as last resort
    try {
      // CryptoCompare uses symbols like BTC, ETH, etc.
      const symbolShort = symbol.replace("USDT", "");
      const cryptocompareRes = await axios.get(
        `https://min-api.cryptocompare.com/data/v2/histominute`,
        {
          params: { fsym: symbolShort, tsym: "USD", limit: 30 },
        }
      );
      const formattedData = cryptocompareRes.data.Data.Data.map((c) => ({
        time: c.time * 1000,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volumefrom,
      }));
      return res.json({ source: "cryptocompare", data: formattedData });
    } catch (error) {
      console.error("Error fetching CryptoCompare data:", error.response?.data);
    }

    res.json({ source: "unknown", data: [] });
  } catch (error) {
    console.error("Error fetching candlestick data:", error.response?.data);
    res.status(500).json({ error: "Failed to fetch candlestick data" });
  }
});

// Get latest price
router.get("/price/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const coinMap = {
    BTCUSDT: "bitcoin",
    ETHUSDT: "ethereum",
    BNBUSDT: "binancecoin",
    LTCUSDT: "litecoin",
    XRPUSDT: "ripple",
    // Add more mappings as needed
  };
  const coinId = coinMap[symbol];

  if (!coinId) {
    return res.status(400).json({ error: "Unsupported symbol" });
  }

  try {
    // Try Binance first (optional, not implemented)
    // Fallback to CoinGecko
    try {
      const coingeckoRes = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price`,
        {
          params: { ids: coinId, vs_currencies: "usd" },
        }
      );
      const price = coingeckoRes.data[coinId]?.usd;
      if (!price) throw new Error("Price not found in CoinGecko response");
      return res.json({ source: "coingecko", price });
    } catch (coingeckoError) {
      console.error("Error fetching CoinGecko price:", coingeckoError.response?.data);
    }

    // Try CryptoCompare as last resort
    try {
      const symbolShort = symbol.replace("USDT", "");
      const cryptocompareRes = await axios.get(
        `https://min-api.cryptocompare.com/data/price`,
        {
          params: { fsym: symbolShort, tsyms: "USD" },
        }
      );
      const price = cryptocompareRes.data.USD;
      if (!price) throw new Error("Price not found in CryptoCompare response");
      return res.json({ symbol, source: "cryptocompare", price });
    } catch (error) {
      console.error("Error fetching CryptoCompare price:", error.response?.data);
    }

    // Try CoinCap
    try {
      const coincapRes = await axios.get(
        `https://api.coincap.io/v2/assets/${coinId}`
      );
      const price = parseFloat(coincapRes.data.data.priceUsd);
      if (!price) throw new Error("Price not found in CoinCap response");
      return res.json({ symbol, source: "coincap", price });
    } catch (error) {
      console.error("Error fetching CoinCap price:", error.response?.data);
    }

    res.status(500).json({ error: "Failed to fetch price" });
  } catch (error) {
    console.error("Error fetching price:", error.response?.data);
    res.status(500).json({ error: "Failed to fetch price" });
  }
});


// ✅ Get multiple coin prices at once
// routes/marketRoutes.js


// ✅ Fetch multiple coins with reliable sources
router.get("/prices", async (req, res) => {
  try {
    const coins = ["bitcoin", "ethereum", "solana"];
    const response = await axios.get(
      "https://api.coinstats.app/public/v1/coins?skip=0&limit=50&currency=USD"
    );

    const data = response.data.coins;
    const result = {};

    coins.forEach((coin) => {
      const found = data.find(
        (item) => item.id.toLowerCase() === coin.toLowerCase()
      );
      if (found) {
        result[coin] = {
          usd: found.price,
          usd_24h_change: found.priceChange1d,
        };
      } else {
        result[coin] = { usd: 0, usd_24h_change: 0 };
      }
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching market data:", error.message);
    res.status(500).json({ error: "Failed to fetch market data" });
  }
});


export default router;
// ...end of file...



