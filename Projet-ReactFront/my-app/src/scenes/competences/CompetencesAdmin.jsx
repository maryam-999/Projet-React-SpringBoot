import {
    Box,
    Button,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Tooltip,
    MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect, useContext } from 'react';
import Header from "../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AuthContext from "../../context/AuthContext";
import { createCompetence, deleteCompetence, getAllCompetences, updateCompetence } from "../../utils/api";
import { useSnackbar } from 'notistack';

const CompetencesAdmin = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const { authTokens } = useContext(AuthContext);
    const { enqueueSnackbar } = useSnackbar();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const newCompetence = {
            intitule: formData.get("intitule"),
            categorie: formData.get("categorie"),
        };
        try {
            await createCompetence(newCompetence, authTokens?.accessToken);
            enqueueSnackbar('La compétence a été ajoutée avec succès!', { variant: 'success' });
            const competences = await getAllCompetences(authTokens?.accessToken);
            setData(competences);
            handleClose();
        } catch (error) {
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                console.error('Erreur lors de la création de la compétence!', error);
            }
        }
    };

    const processRowUpdate = async (updatedRow) => {
        const { id, intitule, categorie } = updatedRow;
        try {
            await updateCompetence(id, { intitule, categorie }, authTokens?.accessToken);
            enqueueSnackbar('La compétence a été mise à jour avec succès!', { variant: 'success' });
            return updatedRow;
        } catch (error) {
            enqueueSnackbar('Erreur lors de la mise à jour des données!', { variant: 'error' });
            throw error; // pour signaler à MUI que la mise à jour a échoué
        }
    };

    const handleDeleteCompetence = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette compétence ?")) {
            try {
                await deleteCompetence(id, authTokens?.accessToken);
                enqueueSnackbar('La compétence a été supprimée avec succès.', { variant: 'success' });
            } catch (error) {
                console.error("Erreur lors de la suppression :", error);
                enqueueSnackbar(`Erreur lors de la suppression de la compétence.`, { variant: 'error' });
                return;
            }
    
            try {
                const updatedCompetences = await getAllCompetences(authTokens?.accessToken);
    
                if (updatedCompetences && updatedCompetences.length > 0) {
                    setData(updatedCompetences);
                } else {
                    setData([]);
                    enqueueSnackbar("Aucune compétence disponible.", { variant: 'info' });
                }
            } catch (error) {
                console.error('Erreur lors du rafraîchissement des compétences après suppression', error);
                enqueueSnackbar("La compétence a été supprimée mais une erreur est survenue lors du rafraîchissement.", { variant: 'warning' });
            }
        }
    };
    

    useEffect(() => {
        getAllCompetences(authTokens?.accessToken)
            .then(data => setData(data))
            .catch(error => console.log(error));
    }, []);

    const columns = [
        {
          field: "intitule",
          headerName: "Intitulé des compétences générales",
          flex: 1,
          editable: true,
        },
        {
            field: "categorie",
            headerName: "Catégorie",
            width: 120, 
            editable: true,
            type: 'singleSelect',
            valueOptions: ["ENTREPRISE", "INDIVIDU", "SCIENTIFIQUE"],
          },
        {
          field: 'actions',
          headerName: 'Actions',
          type: 'actions',
          width: 130,
          renderCell: (params) => (
            <>
              <Tooltip title="Supprimer">
                <IconButton
                  edge="end"
                  aria-label="Supprimer"
                  onClick={() => handleDeleteCompetence(params.id)}
                >
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
                <Header title="Compétences" subtitle="Gestion des compétences" />
                <Box>
                    <Button
                        onClick={handleOpen}
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                    >
                        <AddIcon sx={{ mr: "10px" }} />
                        Ajouter une compétence
                    </Button>
                    <Box backgroundColor={colors.primary[400]}>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle variant="h5" color="secondary">Ajouter une nouvelle compétence</DialogTitle>
                            <DialogContent>
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        label="Intitulé"
                                        name="intitule"
                                        fullWidth
                                        margin="normal"
                                        required
                                    />
                                    <TextField
                                        label="Catégorie"
                                        name="categorie"
                                        select
                                        fullWidth
                                        margin="normal"
                                        required
                                    >
                                        <MenuItem value="ENTREPRISE">ENTREPRISE</MenuItem>
                                        <MenuItem value="INDIVIDU">INDIVIDU</MenuItem>
                                        <MenuItem value="SCIENTIFIQUE">SCIENTIFIQUE</MenuItem>
                                    </TextField>
                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <Button onClick={handleClose} color="secondary">Annuler</Button>
                                        <Button type="submit" color="secondary">Ajouter</Button>
                                    </Box>
                                </form>
                            </DialogContent>
                            <DialogActions />
                        </Dialog>
                    </Box>
                </Box>
            </Box>
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": { border: "none" },
                    "& .MuiDataGrid-cell": { borderBottom: "none" },
                    "& .name-column--cell": { color: colors.greenAccent[300] },
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
                    processRowUpdate={processRowUpdate}
                    experimentalFeatures={{ newEditingApi: true }}
                    onProcessRowUpdateError={(error) => {
                        console.error("Erreur de mise à jour :", error);
                    }}
                />
            </Box>
        </Box>
    );
};

export default CompetencesAdmin;
