import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import Button, { COLORS } from "../components/Button";
import Input from "../components/Input";
import Combobox from "../components/Combobox";
import { ProviderContext } from "../Web3Provider";
import { crolioAddress, crolioABI } from "../contracts/Crolio";

const LoginPage = () => {
  const navigate = useNavigate();
  const { provider } = useContext(ProviderContext);
  const [showPortfolioConstruction, setShowPortfolioConstruction] =
    useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coins, setCoins] = useState([]);

  const handleCreateClick = () => {
    setShowPortfolioConstruction(true);
  };

  const handlePortfolioCreate = async () => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(crolioAddress, crolioABI, signer);
    const tx = await contract.createBucket(
      name,
      description,
      coins.map((i) => i.address),
      coins.map((i) => i.weight * 100)
    );
    const receipt = await tx.wait();
    const iface = new ethers.utils.Interface(crolioABI);
    const receiptData = iface.parseLog({
      data: receipt.logs[0].data,
      topics: receipt.logs[0].topics,
    });
    const bucketId = receiptData.args[0].toNumber();
    navigate(`/portfolio/${bucketId}`);
  };

  return showPortfolioConstruction ? (
    <div>
      <h1 className="text-2xl font-semibold pb-2">Create a Portfolio</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 252px",
          gridGap: "28px",
          paddingTop: "40px",
        }}
      >
        <div>
          <div className="flex pb-8">
            <Input
              label="Name"
              containerClassName="pr-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="description"
              width="400px"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="pb-14">
            <Combobox
              onChange={(data) => {
                setCoins([...coins, { ...data, weight: 0 }]);
              }}
            />
          </div>
          <table
            style={{
              width: "744px",
              tableLayout: "fixed",
              overflowWrap: "break-word",
            }}
          >
            <thead>
              <th
                className="text-sm font-normal text-p-secondary py-2"
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 120px 1fr",
                  borderBottom: "0.5px solid #6F7071",
                }}
              >
                <td className="text-left">Coins</td>
                <td className="text-left">Weight(%)</td>
                <td className="text-right" />
              </th>
            </thead>
            <tbody>
              {coins.map((item) => (
                <tr
                  key={item.address}
                  className="hover:border hover:border-b-blue rounded"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px 120px 1fr",
                    padding: "8px 0",
                    fontSize: "14px",
                  }}
                >
                  <td className="text-left text-b-blue mx-2">{item.short}</td>
                  <td className="text-left">
                    <input
                      className="border border-input-border rounded bg-transparent outline-none px-4 active:border-white focus:border-white w-20"
                      type="number"
                      value={item.weight}
                      onChange={(e) => {
                        const updatedCoins = coins.map((curr) =>
                          curr.address === item.address
                            ? { ...curr, weight: e.target.value }
                            : curr
                        );
                        setCoins(updatedCoins);
                      }}
                      min={0}
                      max={100}
                    />
                  </td>
                  <td className="text-right mx-2 text-b-blue flex justify-end items-center">
                    <button
                      onClick={() => {
                        const filteredCoins = coins.filter(
                          (coin) => coin.address !== item.address
                        );
                        setCoins(filteredCoins);
                      }}
                    >
                      <img
                        src="/assets/cross.svg"
                        style={{ height: "12px" }}
                        alt="cross"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p className="text-p-secondary font-normal text-base pb-2">
            Minimum Investment Amount
          </p>
          <p className="text-p-green text-2xl font-light flex items-center pb-4">
            10
            <img
              src="/assets/usdc-green.svg"
              alt="usdc"
              style={{ height: "18px", paddingLeft: "2px" }}
            />
          </p>
          <Button
            text="Save Portfolio"
            color={COLORS.INVERTED}
            onClick={handlePortfolioCreate}
          />
        </div>
      </div>
    </div>
  ) : (
    <div>
      <h1 className="text-2xl font-semibold pb-2">Create a Portfolio</h1>
      <p className="text-p-secondary font-normal text-base">Managed by You</p>
      <div className="mt-12 pt-14 px-[104px] flex items-center justify-between">
        <img
          src="/assets/create-portfolio.svg"
          alt="portfolio"
          style={{ height: "332px" }}
        />
        <div className="w-[332px]">
          <h2 className="text-3xl pb-2">Got a great investment Idea?</h2>
          <p className="text-p-secondary font-normal text-base pb-6">
            Add Crypto Coins to create and invest in your own portfolio
          </p>
          <Button
            text="Create Portfolio"
            onClick={handleCreateClick}
            color={COLORS.BLUE}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
