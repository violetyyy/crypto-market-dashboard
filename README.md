#Crypto Market Dashboard

A modern, responsive cryptocurrency market dashboard built with Next.js 15, TypeScript, and Tailwind CSS. The dashboard provides real-time market data from Binance API, allowing users to track live prices, top gainers and losers, and global market statistics.

# FEATURES

# Market Overview

Displays real-time cryptocurrency prices for USDT pairs

Live updates via Binance WebSocket

Sortable columns including Symbol, Price, 24h Change, Volume, and Market Cap

Advanced search and filtering

Pagination for better navigation

Favorites system stored in localStorage

# Charts and Analytics

Coin detail modal with 24-hour price charts

Mini sparkline charts for quick trend visualization

Sections for top gainers and top losers

Global market statistics, including total 24-hour volume and BTC dominance

# Multi-Currency Support

Switch between USD, EUR, and MNT

Real-time conversion rates

Market cap data sourced from CoinGecko API

# Responsive Design

Mobile-first design optimized for all screen sizes

Horizontal scrolling for tables on smaller screens

Touch-friendly interface

Adaptive typography and layouts

# Performance and User Experience

React Query for caching and background updates

Loading skeletons and smooth animations

Error handling and fallback UI

WebSocket throttling for optimal performance

Full TypeScript support for type safety

#### Getting Started

npm or yarn

Clone the repository and install dependencies. Run the development server and open the dashboard in a browser.

# Tech Stack

Next.js 15 with App Router

TypeScript

Tailwind CSS and shadcn/ui

React Query for data fetching and caching

Axios for HTTP requests

Recharts for charts

Native WebSocket API for live updates

Lucide React for icons

Framer Motion for animations

# Data Sources

Binance REST API (/api/v3/ticker/24hr) filtered to USDT pairs

Binance WebSocket API for live price updates

CoinGecko API for market cap and currency conversion data

Binance Klines API for historical price data used in charts

# Highlights

Fully responsive and desktop-first design

Real-time updates without page refresh

Smart pagination with ellipsis for easier navigation

Optimized performance with React Query caching and WebSocket throttling

Clean, modern interface with smooth animations

Full TypeScript support for safer, maintainable code

# Notes

EUR/MNT conversion rates are placeholder values

CoinGecko API has rate limits for free usage

WebSocket updates are throttled for smooth UI

Market cap refreshes every five minutes, price data every sixty seconds

# DEPLOYMENT LINK

https://crypto-market-dashboard-seven.vercel.app/
