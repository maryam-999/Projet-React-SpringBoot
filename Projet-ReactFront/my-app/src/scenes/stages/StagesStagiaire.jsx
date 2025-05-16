import { Box, Button, useTheme, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect, useContext } from 'react';
import Header from "../../components/Header";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AuthContext from "../../context/AuthContext";
import { getStagesWithEvaluationsByStagiaireIdAndRole } from "../../utils/api";
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import exportWordFile from '../../components/Wordfile';

const StagesStagiaire = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);
    const { authTokens, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

  


    const getStatusColor = (dateDebut, dateFin) => {
        const today = new Date();
        const start = new Date(dateDebut);
        const end = new Date(dateFin);

        if (end < today) return 'past';
        if (start > today) return 'future';
        return 'ongoing';
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await getStagesWithEvaluationsByStagiaireIdAndRole(authTokens?.accessToken, user?.id);
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
                console.log(e);
            }
        })();
    }, [authTokens, user]);

    const columns = [
        { field: "theme", headerName: "Thème", flex: 3 },
        { field: "objectif", headerName: "Objectif", flex: 1 },
        { field: "entreprise", headerName: "Entreprise", flex: 1 },
        { field: "tuteurNomComplet", headerName: "Tuteur", flex: 1 },
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
            field: "noteScientifique",
            headerName: "Note Scientifique",
            flex: 1,
        },
        {
            field: "noteIndividu",
            headerName: "Note Individuelle",
            flex: 1,
        },
        {
            field: "noteEntreprise",
            headerName: "Note Entreprise",
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 180,
            renderCell: (params) => {
                const isEvaluated =
                    params.row.noteScientifique !== '-' &&
                    params.row.noteIndividu !== '-' &&
                    params.row.noteEntreprise !== '-';
        
                return (
                    <Tooltip title={
                        isEvaluated
                            ? "Télécharger le formulaire d’évaluation"
                            : "Ce stage n'est pas encore évalué"
                    }>
                        <span>
                            <IconButton
                                edge="end"
                                aria-label="Télécharger"
                                onClick={() => {
                                    if (isEvaluated) {
                                        console.log(params.row);
                                        exportWordFile(params.row);  
                                    }
                                }}
                                disabled={!isEvaluated}
                            >
                                <FileDownloadOutlinedIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                );
            },
        },
        
    ];

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Mes Stages & Evaluations" subtitle="Suivez en temps réel vos stages et découvrez toutes vos évaluations !" />
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

export default StagesStagiaire;
