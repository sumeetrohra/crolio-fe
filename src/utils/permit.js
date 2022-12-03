import { ethers } from "ethers";

export const getPermitSignature = async (
  signer,
  token,
  spender,
  value,
  deadline
) => {
  const eoaAddress = await signer.getAddress();
  const [nonce, name, version, chainId] = await Promise.all([
    token.nonces(eoaAddress),
    token.name(),
    "1",
    80001,
  ]);

  return ethers.utils.splitSignature(
    await signer._signTypedData(
      {
        name,
        version,
        chainId,
        verifyingContract: token.address,
      },
      {
        Permit: [
          {
            name: "owner",
            type: "address",
          },
          {
            name: "spender",
            type: "address",
          },
          {
            name: "value",
            type: "uint256",
          },
          {
            name: "nonce",
            type: "uint256",
          },
          {
            name: "deadline",
            type: "uint256",
          },
        ],
      },
      {
        owner: eoaAddress,
        spender,
        value,
        nonce,
        deadline,
      }
    )
  );
};
