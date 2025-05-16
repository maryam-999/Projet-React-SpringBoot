import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "../scenes/global/Topbar";
import TuteurHome from "../scenes/dashboard/TuteurHome";
import SidebarTuteur from "../scenes/global/SidebarTuteur";
import Calendar from "../scenes/calendar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from '../theme'
import Page404 from "./Page404";
import { AuthProvider } from "../context/AuthContext";
import StagesTuteur from "../scenes/stages/StagesTuteur";
import EvaluationCreateForm from "../scenes/form/EvaluationCreateForm";
import EvaluationUpdateForm from "../scenes/form/EvaluationUpdateForm";

const TuteurDashboard = () => {
  const [theme, colorMode] = useMode();//hook
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <AuthProvider>
            <SidebarTuteur isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/encadrement" element={<StagesTuteur />} />
                <Route path="/encadrement/ajouterEvaluation/:id_stage" element={<EvaluationCreateForm />} />
                <Route path="/encadrement/modifierEvaluation/:id_stage/:id_evaluation" element={<EvaluationUpdateForm />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="home" element={<TuteurHome />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </main>
          </AuthProvider>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default TuteurDashboard;