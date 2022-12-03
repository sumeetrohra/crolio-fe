import React, { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const APIURL = "https://api.thegraph.com/subgraphs/name/sumeetrohra/crolio";

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const LoginPage = () => {
  const [buckets, setBuckets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const bucketsQuery = `
    {
      buckets {
        id
        bucketId
        bucketName
        description
        tokens
        weightages
        blockTimestamp
      }
    }
  `;

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
  }, []);

  return (
    <div className="mt-[48px]">
      <div className="flex border-b border-input-border">
        <p className="text-[16px] ml-4 text-white underline-offset-[9px]">
          All Portfolios
        </p>
      </div>
      {buckets.map((bucket) => (
        <div
          onClick={() => navigate(`/portfolio/${bucket.bucketId}`)}
          key={bucket.id}
          className="h-[128px] w-[880px] py-4 px-6 flex justify-between items-start border-b border-input-border cursor-pointer"
        >
          <div className="flex">
            <img
              src="/assets/portfolio.svg"
              alt="logo"
              style={{ width: "48px", height: "48px" }}
            />
            <div className="flex flex-col ml-3">
              <p className="font-semibold text-[18px]">{bucket.bucketName}</p>
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
              10
              <img
                src="/assets/usdc-green.svg"
                alt="usdc"
                style={{ height: "18px", paddingLeft: "2px" }}
              />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoginPage;
