import { buildServer } from "./server.js";

const start = async () => {
  try {
    const app = await buildServer();
    const port = Number(process.env.PORT || 3001);
    const host = process.env.HOST || "0.0.0.0";

    await app.listen({ port, host });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
