import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "../scenes/global/Topbar";
import SidebarAdmin from "../scenes/global/SidebarAdmin";
import AdminHome from "../scenes/dashboard/AdminHome";
import AdminStagiaire from "../scenes/Users/AdminStagiaire";
import AdminTuteur from "../scenes/Users/AdminTuteur";
import StagesAdmin from "../scenes/stages/StagesAdmin";
import Calendar from "../scenes/calendar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from '../theme'
import Page404 from "./Page404";
import { AuthProvider } from "../context/AuthContext";
import FormStagiaire from "../scenes/form/StagiaireForm";
import FormTuteur from "../scenes/form/TuteurForm";
import FormStage from "../scenes/form/StageForm";
import CompetencesAdmin from "../scenes/competences/CompetencesAdmin";



const AdminDashboard = () => {
  const [theme, colorMode] = useMode();//hook
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <AuthProvider>
            <SidebarAdmin isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
              <Route path="stagiaire" element={<AdminStagiaire />} />
              <Route path="stagiaire/modifierStagiaire/:id" element={<FormStagiaire />} />

              <Route path="tuteur" element={<AdminTuteur />} />
              <Route path="tuteur/modifierTuteur/:id" element={<FormTuteur />} /> 
              
              <Route path="competences" element={<CompetencesAdmin />} />

              <Route path="stages" element={<StagesAdmin />} />
              <Route path="stages/modifierStage/:id" element={<FormStage />} /> 
              <Route path="calendar" element={<Calendar />} />
              <Route path="home" element={<AdminHome />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </main>
          </AuthProvider>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default AdminDashboard;