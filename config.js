const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "lAcWFR7Y#Fn2cGZfcIjsU6QfTopeXeUMHxkUii64J-wOoTki10wc",
  MONGODB: process.env.MONGODB || "https://github.com/sithija-bot/SITHIJA_MD/blob/main/ChatGPT%20Image%20May%2016,%202026,%2009_18_56%20PM.png?raw=true",
  OWNER_NUM: process.env.OWNER_NUM || "94785936039",
};
