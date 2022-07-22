import { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Loading from "./components/Loading";
import { useGlobalContext, GlobalStateProvider } from "./context/globalContext";
import reducer, { initialValue, actionTypes } from "./reducer/globalReducer";
import { actions } from "./data/db";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const userId = window.localStorage.getItem("userId");
  const [{ user }, dispatch] = useGlobalContext();

  useEffect(() => {
    if (!userId) {
      return setIsLoaded(true);
    }
    (async () => {
      const user = await actions.getUser(userId);
      if (user) {
        dispatch({ type: actionTypes.SET_USER, payload: { user } });
      }

      return setIsLoaded(true);
    })();
  }, []);

  return (
    <div className="App">
      {isLoaded ? user ? <Home /> : <Login /> : <Loading />}
    </div>
  );
}

export default App;
