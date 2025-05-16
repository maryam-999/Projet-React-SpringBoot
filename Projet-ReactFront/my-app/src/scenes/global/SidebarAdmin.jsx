import { useState, useContext } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import AuthContext from "../../context/AuthContext";
import HandshakeIcon from '@mui/icons-material/Handshake';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';




const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const SidebarAdmin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  let { user, logoutUser } = useContext(AuthContext)

  function stringAvatar() {
    return {
      sx: {
        // background: `${colors.grey[400]}`,
        backgroundColor: '#009688',
        
      },
      children: `${user.prenom.split(' ')[0][0]}${user.nom.split(' ')[0][0]}`,
    };
  }
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                TrackUp
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
              <Stack direction="row" spacing={2}>
                <Avatar {...stringAvatar(user.prenom, user.nom)} />
                </Stack>
              </Box>
              <Box textAlign="center">
                {user ? (
                  <>
                    <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
                      {user.prenom}
                    </Typography>
                    <Typography variant="h5" color={colors.greenAccent[500]}>
                      Admin
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h5" color={colors.grey[500]}>
                    Veuillez vous connecter pour voir les informations de l'utilisateur
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="home"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Membres
            </Typography>
            <Item
              title="Stagiaires"
              to="stagiaire"
              icon={<GroupOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             <Item
              title="Tuteurs"
              to="tuteur"
              icon={<BadgeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Gestion
            </Typography>
            <Item
              title="Stages"
              to="stages"
              icon={<ApartmentOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             
             <Item
              title="Compétences"
              to="competences"
              icon={<TrackChangesOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Calendrier"
              to="calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Quitter
            </Typography>
            <MenuItem onClick={logoutUser}
              icon={<ExitToAppOutlinedIcon />}
              style={{
                color: colors.grey[100],
              }}
          >
              <Typography>Se déconnecter</Typography>
            </MenuItem>

          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default SidebarAdmin;