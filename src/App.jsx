import { HashRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { CursorProvider } from "./context/CursorContext";

const App = () => {
  return (
    <HashRouter>
      <CursorProvider>
        <AppRouter />
      </CursorProvider>
    </HashRouter>
  );
};

export default App;
