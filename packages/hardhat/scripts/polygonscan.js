const hre = require("hardhat");

async function main() {
  await hre.run("polygonscan");
  console.log(
    "✅  Every contract has been successfully submitted to PolygonScan."
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
