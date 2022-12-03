import React, { useContext } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

import { ProviderContext } from "../Web3Provider";

const Layout = (props) => {
  const path = window.location.pathname;

  const { eoa } = useContext(ProviderContext);

  const address =
    eoa && `0x${eoa.split("x")[1].slice(0, 4)}..${eoa.split("x")[1].slice(36)}`;

  return (
    <div className="overflow-auto min-w-screen min-h-screen bg-layout-bg text-white">
      <header
        className="h-14 flex items-center p-0"
        style={{ borderBottom: "0.5px solid #6F7071" }}
      >
        <div className="container max-w-[1080px] mx-auto text-p-secondary text-sm flex justify-between items-center">
          <span className="flex justify-center items-center">
            <Link to="/" className={classnames(["mr-10"])}>
              <img src="/assets/home-logo.svg" alt="logo" className="h-8" />
            </Link>
            <Link
              to="/"
              className={classnames([
                "mr-10",
                {
                  "text-white underline underline-offset-[21px]":
                    path === "/" || path.includes("/portfolio"),
                },
              ])}
            >
              Home
            </Link>
            <Link
              to="/discover"
              className={classnames([
                "mr-10",
                {
                  "text-white underline underline-offset-[21px]":
                    path === "/discover",
                },
              ])}
            >
              Discover
            </Link>
            <Link
              to="/create"
              className={classnames([
                "mr-10",
                {
                  "text-white underline underline-offset-[21px]":
                    path === "/create",
                },
              ])}
            >
              Create
            </Link>
          </span>
          <span className="flex justify-center items-center">
            {eoa && (
              <div className="px-4 py-2 text-white bg-b-blue rounded">
                {address}
              </div>
            )}
            <img
              src="/assets/protocols.svg"
              alt="polygon logo"
              className="ml-6"
            />
          </span>
        </div>
      </header>
      <div className="container max-w-[1080px] mx-auto pt-12">
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
