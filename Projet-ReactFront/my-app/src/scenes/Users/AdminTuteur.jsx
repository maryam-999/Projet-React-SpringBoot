import { Box, Button, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, MenuItem, Select, InputLabel, FormControl, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect,useContext } from 'react';
import Header from "../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AuthContext from "../../context/AuthContext";
import { getAllTuteurs, createTuteur, deleteTuteur } from "../../utils/api";
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';



const AdminTuteur = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const { authTokens} = useContext(AuthContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleEditfonct = (id) => {
    navigate(`modifierTuteur/${id}`);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const userData = {
      nom: formData.get('nom'),
      prenom: formData.get('prenom'),
      email: formData.get('email'),
      password: formData.get('password'),
      entreprise: formData.get('entreprise')
    };
    try {
      const response = await createTuteur(userData,authTokens?.accessToken);
      enqueueSnackbar('Le tuteur a été ajouté avec succès.', { variant: 'success' });
      handleClose();
      const users = await getAllTuteurs(authTokens?.accessToken);
      setData(users || []);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });}
  };



  const handleDeletetuteur = async (id) => {
    if (window.confirm("Attention : la suppression de ce stagiaire peut affecter des stages ou des évaluations qui lui sont associés.")) {
      try {
        await deleteTuteur(id, authTokens?.accessToken);
          let users = [];
        try {
          users = await getAllTuteurs(authTokens?.accessToken);
  
          if (users === null || users.length === 0) {
            setData([]);
            enqueueSnackbar("Le dernier tuteur a été supprimé. La liste est maintenant vide.", { variant: 'info' });
          } else {
            setData(users);
            enqueueSnackbar("Tuteur supprimé avec succès.", { variant: 'success' });
          }
        } catch (fetchError) {
          console.error("Erreur lors du chargement des tuteurs :", fetchError);
          if (users === null || users.length === 0) {
            setData([]);
            enqueueSnackbar("Le dernier tuteur a été supprimé. La liste est maintenant vide.", { variant: 'info' });
          } else {
            enqueueSnackbar("Tuteur supprimé, mais une erreur est survenue lors du rafraîchissement de la liste.", { variant: 'warning' });
          }
        }
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        enqueueSnackbar("Erreur lors de la suppression du tuteur.", { variant: 'error' });
      }
    }
  };



  useEffect(() => {
    (async () => {
      try {
        const res = await getAllTuteurs(authTokens?.accessToken);
        if (Array.isArray(res)) {
          const mappedData = res.map(item => ({
            id: item.id,
            nom: item.nom || '-',
            prenom: item.prenom || '-',
            email: item.email || '-',
            entreprise: item.entreprise || '-',
          }));
          setData(mappedData);
        } else {
          setData([]);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [authTokens]);


  const columns = [

    {
      field: "nom",
      headerName: "Nom",
      flex: 1,

    },
    {
      field: "prenom",
      headerName: "Prenom",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "entreprise",
      headerName: "Entreprise",
      flex: 0.9,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 130,
      renderCell: (params) => (
        <>
        <Tooltip title="Modifier">
          <IconButton edge="end" aria-label="Modifier" onClick={() => handleEditfonct(params.id)}>
            <EditIcon />
          </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
          <IconButton edge="end" aria-label="Supprimer" onClick={() => handleDeletetuteur(params.id)}>
            <DeleteIcon />
          </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Administration des Tuteurs" subtitle="Supervisez et administrez efficacement vos tuteurs" />

        <Box>
          <Button onClick={handleOpen}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <AddIcon sx={{ mr: "10px" }} />
            Ajouter un tuteur
          </Button>
          <Box
            backgroundColor={colors.primary[400]}
          >
            <Dialog open={open}
              onClose={handleClose} 
            >
              <DialogTitle variant="h5" color="secondary">Ajouter un nouveau tuteur</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Nom"
                    name="nom"
                    fullWidth
                    margin="normal"
                    required={true}
                  />
                  <TextField
                    label="Prénom"
                    name="prenom"
                    fullWidth
                    margin="normal"
                    required={true}
                  />
                   <TextField
                    label="Entreprise"
                    name="entreprise"
                    fullWidth
                    margin="normal"
                    required={true}
                  />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <TextField
                        label="Adresse email"
                        name="email"
                        fullWidth
                        type="email"
                        margin="normal"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Mot de passe"
                        name="password"
                        fullWidth
                        type="password"
                        margin="normal"
                        InputProps={{ minLength: 8 }}
                        required={true}
                      />
                    </Grid>
                  </Grid>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleClose} color="secondary">Annuler</Button>
                    <Button type="submit" color="secondary">Ajouter</Button>
                  </div>
                </form>
              </DialogContent>
              <DialogActions>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[800],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[800],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
        />
      </Box>
    </Box>
  );
};
export default AdminTuteur;