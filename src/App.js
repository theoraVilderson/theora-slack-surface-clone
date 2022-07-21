import { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Loading from "./components/Loading";
import { useGlobalContext } from "./context/globalContext";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [{ user }] = useGlobalContext();
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 5000);
  }, []);

  return (
    <div className="App">
      {isLoaded ? user ? <Home /> : <Login /> : <Loading />}
    </div>
  );
}

export default App;
