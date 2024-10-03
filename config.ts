import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const port = process.env.PORT || 5000;
const env = process.env.ENVIRONMENT || "local";
const isProduction = process.env.NODE_ENV === "production";

const rootDir = __dirname;

const configurations: {
  port: string | number;
  env: string;
  isProduction: boolean;
  rootDir: string;
} = {
  port,
  env,
  isProduction,
  rootDir,
};

export default configurations;
