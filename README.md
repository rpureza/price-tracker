# Price Tracker with Email Alerts

A tool that tracks cryptocurrency prices and sends email alerts when a price crosses a set threshold — the same concept used by real-world price tracking tools (e.g. price drop alerts, restock alerts).

## Status: In Progress

- [x] Project setup + CoinGecko API connection
- [ ] Scheduled price checks (cron)
- [ ] Email alerts on threshold cross
- [ ] Database for tracked coins/thresholds
- [ ] Frontend to manage tracked coins
- [ ] Deployment

## Tech Stack

- **Backend:** Node.js, Express
- **API:** CoinGecko (free, public crypto price API)
- **Coming soon:** node-cron (scheduling), Nodemailer (email), MongoDB (storage), React (frontend)

## Running locally

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Server runs on `http://localhost:5000`.

Test it: `GET http://localhost:5000/api/price/bitcoin`
