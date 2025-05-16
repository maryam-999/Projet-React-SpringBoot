import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import PrivateRoutes from "./utils/PrivateRoutes";
import Page404 from "./pages/Page404";
import Login from "../src/pages/Login";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import StagiaireDashboard from "./pages/StagiaireDashboard";  
import TuteurDashboard from "./pages/TuteurDashboard";
import { SnackbarProvider } from 'notistack';

function App() {
  const [theme, colorMode] = useMode();//hook

  return (
    <ColorModeContext.Provider value={colorMode}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <CssBaseline />
        <div className="app">
          <AuthProvider>
            <main className="content">
              <Routes>
                <Route path="/" element={<Login />} />
                
                <Route element={<PrivateRoutes allowedRoles={["STAGIAIRE"]} />}>
                  <Route path="/StagiaireDashboard/*" element={<StagiaireDashboard />} />
                </Route>

                <Route element={<PrivateRoutes allowedRoles={["ADMIN"]} />}>
                  <Route path="/AdminDashboard/*" element={<AdminDashboard />} />
                </Route>

                <Route element={<PrivateRoutes allowedRoles={["TUTEUR"]} />}>
                  <Route path="/TuteurDashboard/*" element={<TuteurDashboard />} />
                </Route>
              
                <Route path="*" element={<Page404 />} />
              </Routes>
            </main>
          </AuthProvider>
        </div>
        </SnackbarProvider>
    </ColorModeContext.Provider>
  );
}

export default App;