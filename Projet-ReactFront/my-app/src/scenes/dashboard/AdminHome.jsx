import { Box, Button, IconButton, Typography, useTheme, Tooltip } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect, useContext } from 'react';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StatBox from "../../components/StatBox";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Header from "../../components/Header";
import DistributionStagiairesInstitution from "../../BARChart/DistributionStagiairesInstitution";
import { getStatisticsAdmin } from "../../utils/api";
import DistributionTuteursEntreprise from "../../BARChart/DistributionTuteursEntreprise";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import SecteurUser from "../../PieChart/SecteurUser";


const AdminHome = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(0);
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);



  useEffect(() => {
    getStatisticsAdmin(authTokens?.accessToken)
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
              navigate("/AdminDashboard/calendar");
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
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.totalStagiaires}
            subtitle="Total des stagiaires inscrits"
            progress={data.totalStagiaires / 100}
            increase=""
            icon={
              <PeopleAltIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.totalTuteurs}
            subtitle="Total des tuteurs inscrits"
            progress={data.totalTuteurs / 100}
            increase=""
            icon={
              <BadgeOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.totalStages}
            subtitle="Total de stages"
            progress={data.totalStages / 100}
            increase=""
            icon={
              <ApartmentOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.stagiairesEnCours}
            subtitle="Total des stagiaires en cours"
            progress={data.stagiairesEnCours / 100}
            increase=""
            icon={
              <TrendingUpOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 - Distribution par rôle + SecteurUser côte à côte */}
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
                Distribution des tuteurs par entreprise
              </Typography>
            </Box>
            <Box>
              <Tooltip title="Accéder à la page des stagiaires">
                <IconButton onClick={() => navigate("/AdminDashboard/stagiaire")}>
                  <VisibilityIcon
                    sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <DistributionTuteursEntreprise isDashboard={true} />
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
            Répartition des utilisateurs par rôle
          </Typography>
          <Box height="240px" mt="-20px">
            <SecteurUser isDashboard={true} />
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
            Distribution des stagiaires par institution
          </Typography>
          <Box height="250px" mt="-20px">
            <DistributionStagiairesInstitution isDashboard={true} />
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default AdminHome;