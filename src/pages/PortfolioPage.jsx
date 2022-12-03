import React, { useEffect, useState, useContext, Fragment } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { Dialog, Transition } from "@headlessui/react";

import Button, { COLORS } from "../components/Button";
import coinList from "../coinList";
import { getPermitSignature } from "../utils/permit";
import { crolioAddress, crolioABI } from "../contracts/Crolio";
import { fUSDCAddress, fUSDCABI } from "../contracts/fUSDC";
import { ProviderContext } from "../Web3Provider";
import Input from "../components/Input";

const APIURL = "https://api.thegraph.com/subgraphs/name/sumeetrohra/crolio";

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const LoginPage = () => {
  const { portfolioId } = useParams();
  const [bucketDetails, setBucketDetails] = useState();
  const { provider } = useContext(ProviderContext);
  const [updateCount, incrementCount] = useState(0);
  const [currentInvestments, setCurrentInvestments] = useState([]);
  const [amountIn, setAmountIn] = useState();

  let [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
    setAmountIn(0);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const bucketDetailsQuery = `
      {
        buckets(where:{ bucketId: ${portfolioId} }) {
          id
          bucketId
          bucketName
          description
          tokens
          weightages
          blockTimestamp
        }
        investedInBuckets(where:{ bucketId: ${portfolioId} }) {
          id
          bucketId
          amountInvested
          investorAddress
          tokens
          holdingsBought
          blockTimestamp
        }
        withdrawnFromBuckets(where:{ bucketId: ${portfolioId} }) {
          id
          bucketId
          amountOut
          investorAddress
          tokens
          holdingsSold
          blockTimestamp
        }
      }
    `;

    const interval = setInterval(() => {
      client
        .query({
          query: gql(bucketDetailsQuery),
        })
        .then((data) => {
          setBucketDetails(data.data.buckets[0]);
          const investmentData = [
            ...data.data.investedInBuckets,
            ...data.data.withdrawnFromBuckets,
          ].sort((a, b) => b.blockTimestamp - a.blockTimestamp);
          const withdrawIndex = investmentData.findIndex(
            (o) => o.__typename === "WithdrawnFromBucket"
          );
          if (withdrawIndex === -1) {
            setCurrentInvestments(investmentData);
          } else {
            setCurrentInvestments(investmentData.slice(0, withdrawIndex));
          }

          client.resetStore();
        })
        .catch((err) => {
          console.log("Error fetching data: ", err);
        });
    }, 5000);

    return () => clearInterval(interval);
  }, [portfolioId, updateCount]);

  const currInvestment = currentInvestments
    .reduce(
      (acc, curr) => ethers.BigNumber.from(curr.amountInvested).add(acc),
      ethers.BigNumber.from("0")
    )
    .toString();

  const currInvestmentStrLength = currInvestment.length;

  return !bucketDetails ? (
    <div>Loading...</div>
  ) : (
    <div>
      <h1 className="text-2xl font-semibold pb-10">
        {bucketDetails.bucketName}
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 252px",
          gridGap: "28px",
          paddingTop: "40px",
        }}
      >
        <div>
          <h3
            className="pb-2 text-base font-medium"
            style={{
              borderBottom:
                currentInvestments.length > 0 ? "0.5px solid #6F7071" : "",
            }}
          >
            Overview
          </h3>
          {currentInvestments.length > 0 && (
            <>
              {" "}
              <p className="mt-4 text-sm font-normal text-p-secondary">
                Current Investment
              </p>
              <p className="text-white text-base font-light flex items-center pb-4">
                <img
                  src="/assets/usdc-white.svg"
                  alt="usdc"
                  style={{ height: "12px", paddingRight: "4px" }}
                />
                {currInvestment.slice(0, currInvestmentStrLength - 18)}
              </p>
              <h3 className="mt-[48px] text-base font-medium mb-1">
                Portfolio Constituents
              </h3>
              <p className="text-sm font-normal text-p-secondary">
                You Currently hold {bucketDetails.tokens.length} coins
              </p>
            </>
          )}
          <table
            style={{
              width: "100%",
              tableLayout: "fixed",
              overflowWrap: "break-word",
              marginTop: "24px",
            }}
          >
            <thead>
              <th
                className="text-sm font-normal text-p-secondary pb-2 pt-[9px] px-0"
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 120px 1fr",
                  borderBottom: "0.5px solid #6F7071",
                }}
              >
                <td className="text-left">Coins</td>
                <td className="text-left">Weight(%)</td>
                {currentInvestments.length > 0 && (
                  <td className="text-left">No of coins</td>
                )}
              </th>
            </thead>
            <tbody>
              {bucketDetails.tokens.map((item, index) => {
                const currInvestment = currentInvestments
                  .reduce(
                    (acc, curr) =>
                      ethers.BigNumber.from(curr.holdingsBought[index]).add(
                        acc
                      ),
                    ethers.BigNumber.from("0")
                  )
                  .toString();

                const currHoldingStrLength = currInvestment.length;
                return (
                  <tr
                    className="text-sm font-normal text-white py-[9px]"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "200px 120px 1fr",
                    }}
                    key={item}
                  >
                    <td>
                      {
                        coinList.find((i) => i.address.toLowerCase() === item)
                          .name
                      }
                    </td>
                    <td>{Number(bucketDetails.weightages[index]) / 100}%</td>
                    {currentInvestments.length > 0 && (
                      <td>
                        {currHoldingStrLength >= 18
                          ? (currHoldingStrLength === 18
                              ? "0"
                              : currInvestment.slice(
                                  0,
                                  currHoldingStrLength - 18
                                )) +
                            "." +
                            currInvestment.slice(currHoldingStrLength - 18)
                          : `0.${new Array(18 - currHoldingStrLength + 1).join(
                              0
                            )}${currInvestment}`}
                      </td>
                    )}
                  </tr>
                );
              })}
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
            text={currentInvestments.length > 0 ? "Invest More" : "Invest Now"}
            color={COLORS.GREEN}
            onClick={async () => {
              openModal();
              return;
            }}
          />
          <div className="mt-4" />
          {currentInvestments.length > 0 && (
            <Button
              text="Withdraw"
              onClick={async () => {
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                  crolioAddress,
                  crolioABI,
                  signer
                );
                const tx = await contract.withdraw(portfolioId);
                console.log(tx);
                const receipt = await tx.wait();
                console.log(receipt);
                incrementCount(updateCount + 1);
              }}
              color={COLORS.BLUE}
            />
          )}
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[536px] max-w-[536px] h-[250px] transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="p"
                    className="h-10 flex items-center justify-between px-4 text-sm font-medium bg-modal-header text-white"
                  >
                    <span>Confirm Investment Amount</span>
                    <img
                      src="/assets/cross-white.svg"
                      alt="cross"
                      onClick={closeModal}
                      className="cursor-pointer"
                    />
                  </Dialog.Title>
                  <div className="bg-login-foreground h-[210px] text-white px-6">
                    <h3 className="pt-8">Amount to Invest</h3>
                    <Input
                      className="mt-3 h-[48px] w-[488px] mb-6"
                      containerClassName="w-[488px]"
                      width="488px"
                      value={amountIn}
                      onChange={(e) => setAmountIn(e.target.value)}
                    />
                    <div className="flex justify-end h-10">
                      <div className="w-[134px] h-10">
                        <Button
                          text="DONE"
                          onClick={async () => {
                            const deadline = ethers.constants.MaxUint256;
                            const signer = provider.getSigner();
                            const investVal = `${amountIn}000000000000000000`;
                            const { v, r, s } = await getPermitSignature(
                              signer,
                              new ethers.Contract(
                                fUSDCAddress,
                                fUSDCABI,
                                signer
                              ),
                              crolioAddress,
                              investVal,
                              deadline
                            );
                            const contract = new ethers.Contract(
                              crolioAddress,
                              crolioABI,
                              signer
                            );
                            const tx = await contract.invest(
                              portfolioId,
                              investVal,
                              deadline,
                              v,
                              r,
                              s
                            );
                            console.log(tx);
                            const receipt = await tx.wait();
                            console.log(receipt);
                            incrementCount(updateCount + 1);
                            closeModal();
                          }}
                          color={COLORS.BLUE}
                          className="h-10 py-3 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div> */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default LoginPage;
