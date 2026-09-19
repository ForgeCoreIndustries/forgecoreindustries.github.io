import { ForgeGrabber } from "./js/forgegrabber-client.js";

const out = document.getElementById("fgOutput");

document.getElementById("fgPingBtn").onclick = async () => {
  out.innerText = JSON.stringify(await ForgeGrabber.ping(), null, 2);
};

document.getElementById("fgGrabBtn").onclick = async () => {
  out.innerText = JSON.stringify(await ForgeGrabber.grab(), null, 2);
};

document.getElementById("fgStatusBtn").onclick = async () => {
  out.innerText = JSON.stringify(await ForgeGrabber.status(), null, 2);
};

document.getElementById("fgResultsBtn").onclick = async () => {
  out.innerText = JSON.stringify(await ForgeGrabber.results(), null, 2);
};
