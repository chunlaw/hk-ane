import fs from "fs";
import { AVAILABLE_HOSPITALS } from "ane-hk";

const host = "https://" + fs.readFileSync("public/CNAME", "utf8");

// constant pages
const pages = [
  "/",
  "/zh/list",
  "/zh/map",
  AVAILABLE_HOSPITALS.en.map(hosp => `/zh/map/${hosp}`),
  AVAILABLE_HOSPITALS.en.map(hosp => `/zh/${hosp}`),
  "/en/list",
  "/en/map",
  AVAILABLE_HOSPITALS.en.map(hosp => `/en/map/${hosp}`),
  AVAILABLE_HOSPITALS.en.map(hosp => `/en/${hosp}`),
].flat();

// write to file
fs.writeFileSync(
  "dist/sitemap.txt",
  pages
    .map((p) => `${host}${p}`)
    .join("\n")
);
fs.writeFileSync(
  ".rsp.json",
  JSON.stringify({
    port: 3100,
    routes: pages,
  })
);
