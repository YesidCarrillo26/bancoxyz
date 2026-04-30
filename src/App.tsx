import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { NewTransferPage } from "./pages/NewTransferPage";
import { HistoryTransferPage } from "./pages/HistoryTransferPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/new-transfer' element={<NewTransferPage />} />
        <Route path='/history' element={<HistoryTransferPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
