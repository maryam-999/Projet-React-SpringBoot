import { Box, Button, useTheme, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect, useContext } from 'react';
import Header from "../../components/Header";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AuthContext from "../../context/AuthContext";
import { getStagesWithEvaluationsByTuteurIdAndRole, deleteEvaluation } from "../../utils/api";
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import exportWordFile from '../../components/Wordfile';


const StagesTuteur = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);
    const { authTokens, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuRowId, setMenuRowId] = useState(null);


    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setMenuRowId(id);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setMenuRowId(null);
    };


    



    const getStatusColor = (dateDebut, dateFin) => {
        const today = new Date();
        const start = new Date(dateDebut);
        const end = new Date(dateFin);

        if (end < today) return 'past';
        if (start > today) return 'future';
        return 'ongoing';
    };

    const fetchData = async () => {
        try {
            const res = await getStagesWithEvaluationsByTuteurIdAndRole(authTokens?.accessToken, user?.id);
            if (Array.isArray(res)) {
                const mappedData = res.map(item => ({
                    id: item.stage?.id,
                    evaluationId: item.evaluation?.id || null,
                    theme: item.stage?.theme || '-',
                    objectif: item.stage?.objectif || '-',
                    entreprise: item.stage?.entreprise || '-',
                    dateFin: item.stage?.dateFin || '-',
                    dateDebut: item.stage?.dateDebut || '-',
                    tuteurNomComplet: item.tuteur ? `${item.tuteur.nom} ${item.tuteur.prenom}` : '-',
                    stagiaireNomComplet: item.stagiaire ? `${item.stagiaire.nom} ${item.stagiaire.prenom}` : '-',
                    stagiaireInstitution: item.stagiaire?.institution || '-',
                    noteScientifique: item.evaluation?.noteScientifique ?? '-',
                    noteIndividu: item.evaluation?.noteIndividu ?? '-',
                    noteEntreprise: item.evaluation?.noteEntreprise ?? '-',
                    implicationActivites: item.evaluation?.implicationActivites || '-',
                    ouvertureAuxAutres: item.evaluation?.ouvertureAuxAutres || '-',
                    qualiteProductions: item.evaluation?.qualiteProductions || '-',
                    observationsTravail: item.evaluation?.observationsTravail || '-',
                    competences: Array.isArray(item.competences) && item.competences.length > 0
                        ? item.competences.map(c => `${c.intitule} (${c.categorie})`).join(', ')
                        : '-',
                    competenceEvaluations: Array.isArray(item.competenceEvaluations) && item.competenceEvaluations.length > 0
                        ? item.competenceEvaluations.map(ce => `${ce.niveau} (Comp ID: ${ce.competenceId})`).join(', ')
                        : '-',
                    competenceSpecifiques: Array.isArray(item.competenceSpecifiqueEvaluations) && item.competenceSpecifiqueEvaluations.length > 0
                        ? item.competenceSpecifiqueEvaluations.map(cs => `${cs.intitule} - ${cs.niveau}`).join(', ')
                        : '-',
                    competenceEvaluationsArray: item.evaluation?.competenceEvaluations || [],
                    competenceSpecifiquesArray: item.evaluation?.competencesSpecifiques || [],
                    statut: item.evaluation ? 'Évalué' : 'Non évalué',
                }));
                setData(mappedData);
            } else {
                setData([]);
            }
        } catch (e) {
            enqueueSnackbar("Erreur lors du chargement des données", { variant: "error" });
        }
    };

    useEffect(() => {
        fetchData();
    }, [authTokens, user]);

    const handleDeleteEvaluation = async (id) => {
        try {
            await deleteEvaluation(id, authTokens?.accessToken);
            enqueueSnackbar("L'évaluation a été supprimée avec succès.", { variant: "success" });
            await fetchData();
        } catch (error) {
            enqueueSnackbar("Échec de la suppression de l'évaluation.", { variant: "error" });
        }
    };

    const columns = [
        { field: "theme", headerName: "Thème", flex: 3 },
        { field: "objectif", headerName: "Objectif", flex: 1 },
        { field: "stagiaireInstitution", headerName: "Institution", flex: 1 },
        { field: "stagiaireNomComplet", headerName: "Stagiaire", flex: 1 },
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
            field: 'statut',
            headerName: 'Statut',
            flex: 1,
            type: 'actions',
            width: 180,
            renderCell: (params) => {
                const isEvaluated =
                    params.row.noteScientifique !== '-' &&
                    params.row.noteIndividu !== '-' &&
                    params.row.noteEntreprise !== '-';

                return (
                    <Box display="flex" alignItems="center" justifyContent="center">
                        {isEvaluated ? (
                            <Tooltip title="Évalué">
                                <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                            </Tooltip>
                        ) : (
                            <Tooltip title="Non évalué">
                                <CancelIcon sx={{ color: theme.palette.error.main }} />
                            </Tooltip>
                        )}
                    </Box>
                );
            },
        },


        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 150,
            renderCell: (params) => {
                const isEvaluated =
                    params.row.noteScientifique !== '-' &&
                    params.row.noteIndividu !== '-' &&
                    params.row.noteEntreprise !== '-';

                const open = menuRowId === params.row.id;

                return (
                    <Box>
                        <IconButton
                            aria-controls={open ? 'actions-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={(e) => handleClick(e, params.row.id)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="actions-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    navigate(`ajouterEvaluation/${params.row.id}`, { state: params.row });
                                    handleClose();
                                }}
                                disabled={isEvaluated}
                            >
                                <AddIcon fontSize="small" sx={{ mr: 1 }} />
                                Ajouter Évaluation
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    navigate(`modifierEvaluation/${params.row.id}/${params.row.evaluationId}`, { state: params.row });
                                    handleClose();
                                }}
                                disabled={!isEvaluated}
                            >
                                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                                Modifier Évaluation
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette évaluation ? Cette action supprimera toutes les compétences déjà évaluées pour ce stagiaire.");
                                    if (confirmDelete) {
                                        handleDeleteEvaluation(params.row.evaluationId);
                                        handleClose();
                                    }
                                }}
                                disabled={!isEvaluated}
                            >
                                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                                Supprimer Évaluation
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    exportWordFile(params.row);  
                             }   
                                }
                                disabled={!isEvaluated}
                            >
                                <FileDownloadOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                                Télécharger Fiche
                            </MenuItem>
                        </Menu>
                    </Box>
                );
            },
        }


    ];
    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Suivi des Stages Encadrés" subtitle="Gérez vos stages encadrés et accédez aux évaluations en un clin d’œil." />
                <Box>
                    <Button
                        onClick={() => {
                            navigate("/TuteurDashboard/calendar");
                        }}
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                    >
                        <CalendarTodayOutlinedIcon sx={{ mr: "10px" }} />
                        Ajouter un nouvel événement
                    </Button>
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
                <DataGrid rows={data} columns={columns}
                />
            </Box>
        </Box>
    );
};

export default StagesTuteur;
