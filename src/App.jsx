import Router from "./Router";
import Web3Provider from "./Web3Provider";

const App = () => {
  return (
    <Web3Provider>
      <Router />
    </Web3Provider>
  );
};

export default App;
