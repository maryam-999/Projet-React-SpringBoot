import { Box, Button, IconButton, Typography, useTheme, Tooltip } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect, useContext } from 'react';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import StatBox from "../../components/StatBox";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Header from "../../components/Header";
import { getStatisticsTuteur } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import SecteurEvaluationRemplitNoNRemplit from "../../PieChart/SecteurEvaluationRemplitNoNRemplit";
import StagesParMoisBarChart from "../../BARChart/StagesParMoisBarChart";
import DistributionStagesParInstitutionTuteur from "../../BARChart/DistributionStagesParInstitutionTuteur";
import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined';



const TuteurHome = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(0);
  const navigate = useNavigate();
  const { authTokens,user } = useContext(AuthContext);



  useEffect(() => {
    getStatisticsTuteur(authTokens?.accessToken,user.id)
      .then((data) => setData(data))
      .catch((error) => console.log(error));

  }, []);


  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Tableau de bord" subtitle="Bienvenue sur votre tableau de bord" />

        <Box>
          <Button
            onClick={() => {
              navigate("/StagiaireDashboard/calendar");
            }}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <NotificationAddIcon sx={{ mr: "10px" }} />
            Ajouter un nouvel événement
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.totalStagesEncadres}
            subtitle="Total des stages supervisés (en cours/terminés)"
            progress={data.totalStagesEncadres / 100}
            increase=""
            icon={
              <BadgeOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.stagesEnCours}
            subtitle="Stages actuellement en cours d'encadrement"
            progress={data.stagesEnCours / 100}
            increase=""
            icon={
              <HourglassBottomOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.stagesTermines}
            subtitle="Nombre total de stages encadrés (terminés)"
            progress={data.stagesTermines / 100}
            increase=""
            icon={
              <ChecklistRtlOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Distribution de vos stages encadrés par institution
              </Typography>
            </Box>
            <Box>
              <Tooltip title="Accéder à la page de vos encadrements">
                <IconButton onClick={() => navigate("/TuteurDashboard/encadrement")}>
                  <VisibilityIcon
                    sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <DistributionStagesParInstitutionTuteur  isDashboard={true} />

          </Box>
        </Box>

        <Box

          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            color={colors.grey[100]}
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Répartition des évaluations : Remplies vs Restantes
          </Typography>
          <Box height="240px" mt="-20px">
            <SecteurEvaluationRemplitNoNRemplit isDashboard={true} />
          </Box>
        </Box>




        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
                Activité mensuelle de supervision des stages
          </Typography>
          <Box height="250px" mt="-20px">
          <StagesParMoisBarChart isDashboard={true} />
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default TuteurHome;