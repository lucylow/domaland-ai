import { ethers } from 'ethers';

export interface DeploymentConfig {
  contractABI: ethers.Fragment[];
  contractBytecode: string;
  constructorArgs?: unknown[];
  gasLimit?: number;
}

export interface DeploymentResult {
  address: string;
  transactionHash: string;
  blockNumber?: number;
}

export const deployContract = async (
  signer: ethers.Signer,
  config: DeploymentConfig
): Promise<DeploymentResult> => {
  try {
    const factory = new ethers.ContractFactory(
      config.contractABI,
      config.contractBytecode,
      signer
    );

    const contract = await factory.deploy(
      ...(config.constructorArgs || []),
      {
        gasLimit: config.gasLimit || 2000000
      }
    );

    console.log("Deployment transaction:", contract.deployTransaction.hash);
    
    await contract.deployed();
    
    const receipt = await contract.deployTransaction.wait();
    
    return {
      address: contract.address,
      transactionHash: contract.deployTransaction.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
};

// Helper function to estimate gas
export const estimateDeploymentGas = async (
  signer: ethers.Signer,
  config: DeploymentConfig
): Promise<ethers.BigNumber> => {
  try {
    const factory = new ethers.ContractFactory(
      config.contractABI,
      config.contractBytecode,
      signer
    );

    const deployTransaction = factory.getDeployTransaction(
      ...(config.constructorArgs || [])
    );

    return await signer.estimateGas(deployTransaction);
  } catch (error) {
    console.error("Gas estimation failed:", error);
    throw error;
  }
};
