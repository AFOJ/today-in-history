<div align="center">
<h1>Today in History</h1>
<p><em>An exploration into LLM streaming.</em></p>

<p>
<a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" /></a>
<a href="https://expressjs.com/"> <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" /></a>
<a href="https://ai.google.dev/gemini-api/docs"><img src="https://img.shields.io/badge/Gemini_AI-8E75FF?style=for-the-badge&logo=googlegemini&logoColor=white" /></a>
<a href="https://www.typescriptlang.org/docs/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /></a>
</p>
</div>

## What is this?

This is an exploration in building "live" interfaces. Instead of making users wait for a loading spinner while the AI thinks, this project streams data chunk-by-chunk, rendering historical events on the screen the moment they are generated.

## Structure

- `client` - A [React](https://react.dev/) + [Vite](https://vite.dev/) app to consume/visualise the streaming.
- `server` - An [Express](https://expressjs.com/) server that proxies the LLM stream.

## Installation

1. Clone the repository.

```bash
git clone https://github.com/AFOJ/today-in-history.git
```

2. Follow the setup instructions for the [client](./client/README.md) and [server](./server/README.md).
