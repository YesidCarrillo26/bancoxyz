import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/auth/LoginPage";
import { HomePage } from "@/pages/home/HomePage";
import { NewTransferPage } from "@/pages/app/NewTransferPage";
import { HistoryTransferPage } from "@/pages/app/HistoryTransferPage";
import { ProtectedRoute, GuestRoute } from '@/routes/ProtectedRoute';
import { AuthProvider } from "@/context/AuthContext";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path='/' element={<LoginPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/home' element={<HomePage />} />
            <Route path='/new-transfer' element={<NewTransferPage />} />
            <Route path='/history' element={<HistoryTransferPage />} />
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
