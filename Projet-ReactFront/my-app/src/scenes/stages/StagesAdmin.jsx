import { Box, Button, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, MenuItem, Select, InputLabel, FormControl, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect, useContext } from 'react';
import Header from "../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AuthContext from "../../context/AuthContext";
import { getAllStages, createStage, deleteStage,getTuteursByEntreprise ,getAllStagiaires} from "../../utils/api";
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';



const StagesAdmin = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [tuteurs, setTuteurs] = useState([]);
    const [stagiaires, setStagiaires] = useState([]);
    const [selectedEntreprise, setSelectedEntreprise] = useState('');

    const handleEditstage = (id) => {
        navigate(`modifierStage/${id}`);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTuteurs([]); 
        setSelectedEntreprise('');
    };

    const getStatusColor = (dateDebut, dateFin) => {
        const today = new Date();
        const start = new Date(dateDebut);
        const end = new Date(dateFin);
    
        if (end < today) return 'past';
        if (start > today) return 'future';
        return 'ongoing';
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const userData = {
            theme: formData.get('theme'),
            objectif: formData.get('objectif'),
            entreprise: formData.get('entreprise'),
            dateFin: formData.get('dateFin'),
            dateDebut: formData.get('dateDebut'),
            tuteurId: formData.get('tuteurId'), 
            stagiaireId: formData.get('stagiaireId'), 
        };
        try {
            const response = await createStage(userData, authTokens?.accessToken);
            enqueueSnackbar('Le stage a été ajouté avec succès.', { variant: 'success' });
            handleClose();
            const users = await getAllStages(authTokens?.accessToken);
            const mappedData = users.map(item => ({
                id: item.id,
                theme: item.theme || '-',
                objectif: item.objectif || '-',
                entreprise: item.entreprise || '-',
                dateFin: item.dateFin || '-',
                dateDebut: item.dateDebut || '-',
                tuteurNomComplet: item.tuteur ? `${item.tuteur.nom} ${item.tuteur.prenom}` : '-',
                stagiaireNomComplet: item.stagiaire ? `${item.stagiaire.nom} ${item.stagiaire.prenom}` : '-',
                stagiaireInstitution: item.stagiaire?.institution || '-',
            }));
            setData(mappedData);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };
    
    const handleDeletestage = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce stage ?')) {
            try {
                await deleteStage(id, authTokens?.accessToken);
                enqueueSnackbar('Le stage a été supprimé avec succès.', { variant: 'success' });
            } catch (error) {
                enqueueSnackbar('Erreur lors de la suppression du stage.', { variant: 'error' });
                return;
            }
    
            try {
                let updatedStages = [];
                try {
                    updatedStages = await getAllStages(authTokens?.accessToken);
                        if (updatedStages === null || updatedStages.length === 0) {
                        setData([]);
                        enqueueSnackbar("Aucun stage disponible.", { variant: 'info' });
                    } else {
                        const mappedData = updatedStages.map(item => ({
                            id: item.id,
                            theme: item.theme || '-',
                            objectif: item.objectif || '-',
                            entreprise: item.entreprise || '-',
                            dateFin: item.dateFin || '-',
                            dateDebut: item.dateDebut || '-',
                            tuteurNomComplet: item.tuteur ? `${item.tuteur.nom} ${item.tuteur.prenom}` : '-',
                            stagiaireNomComplet: item.stagiaire ? `${item.stagiaire.nom} ${item.stagiaire.prenom}` : '-',
                            stagiaireInstitution: item.stagiaire?.institution || '-',
                        }));
                        setData(mappedData);
                    }
                } catch (fetchError) {
                    console.log('Erreur lors du rafraîchissement des données après suppression', fetchError);
                    if (updatedStages === null || updatedStages.length === 0) {
                        setData([]);
                        enqueueSnackbar("Aucun stage disponible.", { variant: 'info' });
                    } else {
                        enqueueSnackbar("Le stage a été supprimé, mais une erreur est survenue lors du rafraîchissement.", { variant: 'warning' });
                    }
                }
            } catch (error) {
                console.log('Erreur lors du rafraîchissement des données après suppression', error);
                enqueueSnackbar("Le stage a été supprimé, mais une erreur est survenue lors du rafraîchissement.", { variant: 'warning' });
            }
        }
    };
    
    
    

    const handleEntrepriseChange = async (e) => {
        const entreprise = e.target.value;
        setSelectedEntreprise(entreprise);
        if (entreprise.trim() !== '') {
            try {
                const res = await getTuteursByEntreprise(authTokens?.accessToken, entreprise);
                setTuteurs(res || []);
            } catch (err) {
                console.log(err);
                setTuteurs([]);
            }
        } else {
            setTuteurs([]);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await getAllStages(authTokens?.accessToken);
                if (Array.isArray(res)) {
                    const mappedData = res.map(item => ({
                        id: item.id,
                        theme: item.theme || '-',
                        objectif: item.objectif || '-',
                        entreprise: item.entreprise || '-',
                        dateFin: item.dateFin || '-',
                        dateDebut: item.dateDebut || '-',
                        tuteurNomComplet: item.tuteur ? `${item.tuteur.nom} ${item.tuteur.prenom}` : '-',
                        stagiaireNomComplet: item.stagiaire ? `${item.stagiaire.nom} ${item.stagiaire.prenom}` : '-',
                        stagiaireInstitution: item.stagiaire?.institution || '-',
                    }));
                    setData(mappedData);
                } else {
                    setData([]);
                }

                const allStagiaires = await getAllStagiaires(authTokens?.accessToken);
                setStagiaires(allStagiaires || []);

            } catch (e) {
                console.log(e);
            }
        })();
    }, [authTokens]);

    

    const columns = [

        {
            field: "theme",
            headerName: "Theme",
            flex: 1,

        },
        {
            field: "objectif",
            headerName: "Objectif",
            flex: 1,
        },
        {
            field: "entreprise",
            headerName: "Entreprise",
            flex: 1,
        },
        {
            field: "tuteurNomComplet",
            headerName: "Tuteur",
            flex: 1,
        },
        {
            field: "stagiaireNomComplet",
            headerName: "Stagiaire",
            flex: 1,
        },
        {
            field: "stagiaireInstitution",
            headerName: "Institution",
            flex: 1,
        },
        
        {
            field: "dateDebut",
            headerName: "Date début",
            flex: 1,
            renderCell: (params) => {
                const status = getStatusColor(params.row.dateDebut, params.row.dateFin);
                return (
                    <Box
                        sx={{
                            p: "5px 10px",
                            borderRadius: "8px",
                            color: status === 'past' ? '#d32f2f' :
                                   status === 'ongoing' ? '#f57c00' :
                                   '#2e7d32',
                            fontWeight: 'bold',
                            backgroundColor: status === 'past' ? 'rgba(211, 47, 47, 0.1)' :
                                              status === 'ongoing' ? 'rgba(245, 124, 0, 0.1)' :
                                              'rgba(46, 125, 50, 0.1)',
                        }}
                    >
                        {params.value}
                    </Box>
                );
            },
        },
        
        {
            field: "dateFin",
            headerName: "Date fin",
            flex: 0.9,
            renderCell: (params) => {
                const status = getStatusColor(params.row.dateDebut, params.row.dateFin);
                return (
                    <Box
                        sx={{
                            p: "5px 10px",
                            borderRadius: "8px",
                            color: status === 'past' ? '#d32f2f' :
                                   status === 'ongoing' ? '#f57c00' :
                                   '#2e7d32',
                            fontWeight: 'bold',
                            backgroundColor: status === 'past' ? 'rgba(211, 47, 47, 0.1)' :
                                              status === 'ongoing' ? 'rgba(245, 124, 0, 0.1)' :
                                              'rgba(46, 125, 50, 0.1)',
                        }}
                    >
                        {params.value}
                    </Box>
                );
            },
        }, 
        {
            field: "status",
            headerName: "Statut",
            flex: 1,
            renderCell: (params) => {
                const status = getStatusColor(params.row.dateDebut, params.row.dateFin);
                const label = status === 'past' ? 'Terminé' : status === 'ongoing' ? 'En cours' : 'À venir';
                return (
                    <Box
                        sx={{
                            p: "5px 10px",
                            borderRadius: "8px",
                            fontWeight: 'bold',
                            color: status === 'past' ? '#d32f2f' :
                                   status === 'ongoing' ? '#f57c00' :
                                   '#2e7d32',
                            backgroundColor: status === 'past' ? 'rgba(211, 47, 47, 0.1)' :
                                              status === 'ongoing' ? 'rgba(245, 124, 0, 0.1)' :
                                              'rgba(46, 125, 50, 0.1)',
                        }}
                    >
                        {label}
                    </Box>
                );
            },
        },
               
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 130,
            renderCell: (params) => (
                <>
                    <Tooltip title="Modifier">
                        <IconButton edge="end" aria-label="Modifier" onClick={() => handleEditstage(params.id)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <IconButton edge="end" aria-label="Supprimer" onClick={() => handleDeletestage(params.id)}>
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
                <Header title="Administration des Stages" subtitle="Gérez les stages, leurs affectations associées" />
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
                        Ajouter un stage
                    </Button>
                    <Box backgroundColor={colors.primary[400]}>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle variant="h5" color="secondary">Ajouter un nouveau stage</DialogTitle>
                            <DialogContent>
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        label="Theme"
                                        name="theme"
                                        fullWidth
                                        margin="normal"
                                        required
                                    />
                                    <TextField
                                        label="Objectif"
                                        name="objectif"
                                        fullWidth
                                        margin="normal"
                                        required
                                    />
                                    <TextField
                                        label="Entreprise"
                                        name="entreprise"
                                        fullWidth
                                        margin="normal"
                                        required
                                        value={selectedEntreprise}
                                        onChange={handleEntrepriseChange}
                                    />
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Date début"
                                                name="dateDebut"
                                                fullWidth
                                                type="date"
                                                margin="normal"
                                                required
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Date fin"
                                                name="dateFin"
                                                fullWidth
                                                type="date"
                                                margin="normal"
                                                required
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <FormControl fullWidth margin="normal" required>
                                        <InputLabel id="tuteur-label">Tuteur</InputLabel>
                                        <Select
                                            labelId="tuteur-label"
                                            name="tuteurId"
                                            label="Tuteur"
                                            disabled={tuteurs.length === 0}
                                        >
                                            {tuteurs.map((tuteur) => (
                                                <MenuItem key={tuteur.id} value={tuteur.id}>
                                                    {tuteur.nom} {tuteur.prenom}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth margin="normal" required>
                                        <InputLabel id="stagiaire-label">Stagiaire</InputLabel>
                                        <Select
                                            labelId="stagiaire-label"
                                            name="stagiaireId"
                                            label="Stagiaire"
                                        >
                                            {stagiaires.map((stagiaire) => (
                                                <MenuItem key={stagiaire.id} value={stagiaire.id}>
                                                    {stagiaire.nom} {stagiaire.prenom}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                                        <Button onClick={handleClose} color="secondary">Annuler</Button>
                                        <Button type="submit" color="secondary">Ajouter</Button>
                                    </div>
                                </form>
                            </DialogContent>
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
                    "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[800], borderBottom: "none" },
                    "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
                    "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[800] },
                }}
            >
                <DataGrid rows={data} columns={columns} />
            </Box>
        </Box>
    );
};
export default StagesAdmin;
