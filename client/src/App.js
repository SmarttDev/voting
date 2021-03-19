import React, { useContext } from "react";
import logo from "./logo.svg";
import Web3Context from "context/Web3Context";

function App() {
  const { web3 } = useContext(Web3Context);

  return (
    <div>
      {web3 ? (
        <>
          <section className="text-center bg-white">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-8">
              <span className="block xl:inline">Welcome to ReactJS </span>
              <span className="block text-indigo-600 xl:inline">
                with Truffle boxes
              </span>
            </h1>
            <div className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
              <p>
                Your Truffle Box is installed and ready.
                <br />
              </p>
              <img src={logo} alt="" />
            </div>
          </section>
        </>
      ) : (
        <div>Loading Web3, accounts, and contract...</div>
      )}
    </div>
  );
}

export default App;
