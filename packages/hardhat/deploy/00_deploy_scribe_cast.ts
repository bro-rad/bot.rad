import { deployScript, artifacts } from "../rocketh/deploy.js";

/**
 * Deploys ScribeCast using the deployer account.
 */
export default deployScript(
  async env => {
    const { deployer } = env.namedAccounts;

    await env.deploy("ScribeCast", {
      account: deployer,
      artifact: artifacts.ScribeCast,
    });
  },
  {
    tags: ["ScribeCast"],
  },
);
