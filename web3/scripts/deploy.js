async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const DecentralizedCab = await ethers.getContractFactory('DecentralizedCab');
  const contract = await DecentralizedCab.deploy();
  console.log('Contract deployed to address:', contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
