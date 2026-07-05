const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const contractPath = path.join(__dirname, "api-contract.json");
const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));

assert.equal(contract.project, "CineVerse");
assert.ok(Array.isArray(contract.services));
assert.ok(contract.services.length >= 5);

const requiredServices = ["auth-service", "movie-service", "review-service", "booking-service", "notification-service"];
const names = contract.services.map((service) => service.name);
requiredServices.forEach((serviceName) => assert.ok(names.includes(serviceName), `${serviceName} missing`));

contract.services.forEach((service) => {
  assert.ok(service.storage, `${service.name} storage missing`);
  assert.ok(service.endpoints || service.events, `${service.name} has no endpoints/events`);
});

console.log(" Backend contract verified.");
