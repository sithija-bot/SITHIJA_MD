const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "lAcWFR7Y#Fn2cGZfcIjsU6QfTopeXeUMHxkUii64J-wOoTki10wc",
  MONGODB: process.env.MONGODB || "mongodb://mongo:GveFmLLwRwDsRYbdcgYIfkRaRruinBiH@autorack.proxy.rlwy.net:16141",
  OWNER_NUM: process.env.OWNER_NUM || "94785936039",
};
