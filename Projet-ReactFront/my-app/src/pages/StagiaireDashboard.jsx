import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "../scenes/global/Topbar";
import SidebarStagiaire from "../scenes/global/SidebarStagiaire";
import StagiaireHome from "../scenes/dashboard/StagiaireHome";
import Calendar from "../scenes/calendar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode }  from '../theme'
import Page404 from "./Page404";
import { AuthProvider } from "../context/AuthContext"; 
import StagesStagiaire from "../scenes/stages/StagesStagiaire";

const StagiaireDashboard=() =>{
  const [theme, colorMode] = useMode();//hook
  const [isSidebar, setIsSidebar] = useState(true);


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <AuthProvider>
          <SidebarStagiaire isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
                <Route path="stages" element={<StagesStagiaire />}/>
                <Route path="calendar" element={<Calendar />} />
                <Route path="home" element={<StagiaireHome />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </main>
          </AuthProvider>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default StagiaireDashboard;