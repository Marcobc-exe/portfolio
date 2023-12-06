import { HashRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";

const App = () => {
  return (
    <HashRouter>
      <AppRouter />
    </HashRouter>
  )
}

export default App
