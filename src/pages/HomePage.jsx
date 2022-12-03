import React, { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const APIURL = "https://api.thegraph.com/subgraphs/name/sumeetrohra/crolio";

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const LoginPage = () => {
  const [userInvestments, setUserInvestments] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const investmentQuery = `
    {
      investedInBuckets(where:{ investorAddress: "0x535e1ce11ee1e7227a0bbd3849d85d2e1ccaefc1" }) {
      id
      bucketId
      amountInvested
      investorAddress
      tokens
      holdingsBought
      blockTimestamp
      }
      withdrawnFromBuckets(where:{ investorAddress: "0x535e1ce11ee1e7227a0bbd3849d85d2e1ccaefc1" }) {
        id
        bucketId
        amountOut
        investorAddress
        tokens
        holdingsSold
        blockTimestamp
      }
    }`;

    client
      .query({
        query: gql(investmentQuery),
      })
      .then((data) => {
        const investedBucketIds = Array.from(
          new Set(data.data.investedInBuckets.map((i) => i.bucketId))
        );
        const investments = investedBucketIds
          .map((i) => {
            const invs = [
              ...data.data.investedInBuckets,
              ...data.data.withdrawnFromBuckets,
            ]
              .filter((b) => b.bucketId === i)
              .sort((a, b) => b.blockTimestamp - a.blockTimestamp);
            const withdrawIndex = invs.findIndex(
              (o) => o.__typename === "WithdrawnFromBucket"
            );
            if (withdrawIndex === -1) {
              return {
                bucketId: i,
                investments: invs,
                totalAmount: invs.reduce(
                  (acc, curr) =>
                    ethers.BigNumber.from(curr.amountInvested).add(acc),
                  ethers.BigNumber.from("0")
                ),
              };
            }
            return {
              bucketId: i,
              investments: invs.slice(0, withdrawIndex),
              totalAmount: invs
                .slice(0, withdrawIndex)
                .reduce(
                  (acc, curr) =>
                    ethers.BigNumber.from(curr.amountInvested).add(acc),
                  ethers.BigNumber.from("0")
                ),
            };
          })
          .filter((i) => i.investments.length > 0);
        setUserInvestments(investments);

        client.resetStore();
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
  }, []);

  useEffect(() => {
    if (userInvestments.length > 0) {
      const bucketIdsToFetch = userInvestments.map((i) => i.bucketId);

      const bucketsQuery = `{
          buckets(where:{ bucketId_in: [${bucketIdsToFetch}] }) {
          id
          bucketId
          bucketName
          description
          tokens
          weightages
          blockTimestamp
        }
      }`;

      client
        .query({
          query: gql(bucketsQuery),
        })
        .then((data) => {
          setBuckets(data.data.buckets);
          client.resetStore();
        })
        .catch((err) => {
          console.log("Error fetching data: ", err);
        });
    }
  }, [userInvestments]);

  const totalInvestedValue = userInvestments
    .reduce(
      (acc, curr) => ethers.BigNumber.from(curr.totalAmount).add(acc),
      ethers.BigNumber.from("0")
    )
    .toString();

  const totalInvestedValueStrLength = totalInvestedValue.length;

  return (
    <div>
      <div className="mb-8">
        <div className="h-[152px] bg-hero rounded-lg pl-8 pt-9 flex relative">
          <div>
            <p className="text-[44px]" style={{ lineHeight: "52px" }}>
              Overview
            </p>
            <p className="text-p-secondary text-lg mt-2">
              Market & Your Investments
            </p>
          </div>
          <div
            className="absolute flex items-start justify-center flex-col"
            style={{ left: "540px", top: "42px" }}
          >
            <p className="text-[20px] text-p-secondary">Invested Value</p>
            <p className="text-[32px] font-light">
              {totalInvestedValue.slice(0, totalInvestedValueStrLength - 18)}
            </p>
          </div>
          <img
            src="/assets/usdc-grey.svg"
            alt="usdc"
            style={{
              height: "172px",
              width: "172px",
              position: "absolute",
              right: "136px",
              top: "-10px",
            }}
          />
        </div>
      </div>
      <div className="flex border-b border-input-border">
        <p className="text-[16px] ml-4 text-b-blue underline-offset-[9px] border-b border-b-blue">
          Holdings
        </p>
      </div>
      {buckets.length > 0 &&
        userInvestments.map((inv) => {
          const bucket = buckets.find((item) => item.bucketId === inv.bucketId);
          const totalVal = inv.totalAmount.toString();
          const invLength = totalVal.length;

          return (
            <div
              onClick={() => navigate(`/portfolio/${inv.bucketId}`)}
              key={inv.bucketId}
              className="h-[128px] w-[880px] py-4 px-6 flex justify-between items-start border-b border-input-border cursor-pointer"
            >
              <div className="flex">
                <img
                  src="/assets/portfolio.svg"
                  alt="logo"
                  style={{ width: "48px", height: "48px" }}
                />
                <div className="flex flex-col ml-3">
                  <p className="font-semibold text-[18px]">
                    {bucket.bucketName}
                  </p>
                  <p className="text-p-secondary text-[12px] max-w-[180px]">
                    {bucket.description}
                  </p>
                </div>
              </div>
              <div className="mr-[136px] mt-6">
                <div className="text-[16px] text-p-secondary">
                  Current Investment
                </div>
                <p className="text-p-green text-2xl font-light flex items-center pb-4">
                  {totalVal.slice(0, invLength - 18)}
                  <img
                    src="/assets/usdc-green.svg"
                    alt="usdc"
                    style={{ height: "18px", paddingLeft: "2px" }}
                  />
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default LoginPage;
