import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import React, { useEffect, useContext, useState ,useMemo} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useParams, useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { updateEvaluation, getCompetencesByCategorie } from "../../utils/api";
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import { DataGrid } from '@mui/x-data-grid';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { tokens } from "../../theme";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const niveauxCompetenceLabels = {
    "NA": "N/A",
    "DEBUTANT": "Débutant",
    "AUTONOME": "Autonome",
    "AUTONOME_PLUS": "Autonome+"
};
const niveauxCompetenceMetierLabels = {
    "DEBUTANT": "Débutant",
    "AUTONOME": "Autonome",
    "AUTONOME_PLUS": "Autonome+"
};

const implicationActivitesLabels = {
    "PARESSEUX": "Paresseux",
    "LE_JUSTE_NECESSAIRE": "Le juste nécessaire",
    "BONNE": "Bonne",
    "TRES_FORTE": "Très forte",
    "DEPASSE_SES_OBJECTIFS": "Dépasse ses objectifs"
};

const ouvertureAuxAutresLabels = {
    "ISOLE_OU_EN_OPPOSITION": "Isolé ou en opposition",
    "RENFERME_OU_OBTUS": "Renfermé ou obtus",
    "BONNE": "Bonne",
    "TRES_BONNE": "Très bonne",
    "EXCELLENT": "Excellente"
};

const qualiteProductionsLabels = {
    "MEDIOCRE": "Médiocre",
    "ACCEPTABLE": "Acceptable",
    "BONNE": "Bonne",
    "TRES_BONNE": "Très bonne",
    "TRES_PROFESSIONNELLE": "Très professionnelle"
};

const steps = [
    'Appréciation globale',
    'Compétences liées à l’individu',
    'Compétences liées à l’entreprise',
    'Compétences scientifiques',
    'Compétences spécifiques métier'
];

const EvaluationUpdateForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { id_evaluation, id_stage } = useParams();
    const { authTokens } = useContext(AuthContext);
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);  // Initialisation de activeStep
    const [data, setData] = useState(location.state || {});  // Données provenant de location.state
    const [competencesIndividu, setCompetencesIndividu] = useState([]);
    const [competencesEntreprise, setCompetencesEntreprise] = useState([]);
    const [competencesScientifiques, setCompetencesScientifiques] = useState([]);
    const [competencesSpecifiques, setCompetencesSpecifiques] = useState([]);


    const validationSchema = useMemo(() => {
        switch (activeStep) {
            case 0:
                return yup.object({

                    implicationActivites: yup.string().required('Ce champ est obligatoire'),
                    ouvertureAuxAutres: yup.string().required('Ce champ est obligatoire'),
                    qualiteProductions: yup.string().required('Ce champ est obligatoire'),
                    observationsTravail: yup.string().required('Ce champ est obligatoire'),

                });

            case 1:
                return yup.object({
                    competenceEvaluations: yup.array()
                        .of(
                            yup.object({
                                niveau: yup.string().required('Sélectionnez un niveau'),
                            })
                        )
                        .test(
                            'all-competences-individu',
                            'Toutes les compétences individuelles doivent être évaluées',
                            function (val) {
                                if (!competencesIndividu) return true; // ne valide pas si pas encore chargées
                                const count = val?.filter(c => c.categorie === 'INDIVIDU').length || 0;
                                return count === competencesIndividu.length;
                            }
                        ),
                    noteIndividu: yup.number()
                        .required('Ce champ est obligatoire')
                        .min(0, 'La note doit être ≥ 0')
                        .max(20, 'La note doit être ≤ 20'),
                });

            case 2:
                return yup.object({
                    competenceEvaluations: yup.array()
                        .of(
                            yup.object({
                                niveau: yup.string().required('Sélectionnez un niveau'),
                            })
                        )
                        .test(
                            'all-competences-entreprise',
                            'Toutes les compétences entreprise doivent être évaluées',
                            function (val) {
                                if (!competencesEntreprise) return true;
                                const count = val?.filter(c => c.categorie === 'ENTREPRISE').length || 0;
                                return count === competencesEntreprise.length;
                            }
                        ),
                    noteEntreprise: yup.number()
                        .required('Ce champ est obligatoire')
                        .min(0, 'La note doit être ≥ 0')
                        .max(20, 'La note doit être ≤ 20'),
                });

            case 3:
                return yup.object({
                    competenceEvaluations: yup.array()
                        .of(
                            yup.object({
                                niveau: yup.string().required('Sélectionnez un niveau'),
                            })
                        )
                        .test(
                            'all-competences-scientifique',
                            'Toutes les compétences scientifiques doivent être évaluées',
                            function (val) {
                                if (!competencesScientifiques) return true;
                                const count = val?.filter(c => c.categorie === 'SCIENTIFIQUE').length || 0;
                                return count === competencesScientifiques.length;
                            }
                        ),
                    noteScientifique: yup.number()
                        .required('Ce champ est obligatoire')
                        .min(0, 'La note doit être ≥ 0')
                        .max(20, 'La note doit être ≤ 20'),
                });

            default:
                return yup.object();
        }
    }, [activeStep, competencesIndividu, competencesEntreprise, competencesScientifiques]);



    // Initialisation des valeurs du formulaire
    const [initialValues, setInitialValues] = useState({
        theme: '',
        objectif: '',
        entreprise: '',
        institution: '',
        dateDebut: '',
        dateFin: '',
        tuteurNom: '',
        stagiaireNom: '',
        noteScientifique: '',
        noteIndividu: '',
        noteEntreprise: '',
        implicationActivites: '',
        ouvertureAuxAutres: '',
        qualiteProductions: '',
        observationsTravail: '',
        competenceEvaluations: [],
        competencesSpecifiques: []
    });

    // Mettre à jour les compétences à partir de l'API
    useEffect(() => {
        const fetchCompetences = async () => {
            try {
                const [individu, entreprise, scientifique] = await Promise.all([
                    getCompetencesByCategorie('INDIVIDU', authTokens?.accessToken),
                    getCompetencesByCategorie('ENTREPRISE', authTokens?.accessToken),
                    getCompetencesByCategorie('SCIENTIFIQUE', authTokens?.accessToken),
                ]);
                setCompetencesIndividu(individu);
                setCompetencesEntreprise(entreprise);
                setCompetencesScientifiques(scientifique);
            } catch (error) {
                enqueueSnackbar(`Erreur lors du chargement des compétences : ${error.message}`, { variant: 'error' });
            }
        };

        fetchCompetences();
    }, [authTokens, enqueueSnackbar]);

    // Mettre à jour les données et initialValues dès que location.state est disponible
    useEffect(() => {
        if (location.state) {
            setData(location.state);
        }
    }, [location.state]);

    // Mettre à jour les initialValues quand les données sont présentes
    useEffect(() => {
        if (data) {
            setInitialValues({
                theme: data?.theme || '',
                objectif: data?.objectif || '',
                entreprise: data?.entreprise || '',
                institution: data?.stagiaireInstitution || '',
                dateDebut: data?.dateDebut || '',
                dateFin: data?.dateFin || '',
                tuteurNom: data?.tuteurNomComplet || '',
                stagiaireNom: data?.stagiaireNomComplet || '',
                noteScientifique: data?.evaluation?.noteScientifique ?? '',
                noteIndividu: data?.evaluation?.noteIndividu ?? '',
                noteEntreprise: data?.evaluation?.noteEntreprise ?? '',
                implicationActivites: data?.evaluation?.implicationActivites || '',
                ouvertureAuxAutres: data?.evaluation?.ouvertureAuxAutres || '',
                qualiteProductions: data?.evaluation?.qualiteProductions || '',
                observationsTravail: data?.evaluation?.observationsTravail || '',
                competenceEvaluations: data?.evaluation?.competenceEvaluations || [],
                competencesSpecifiques: data?.evaluation?.competencesSpecifiques || []
            });
        }
    }, [data]);  // Cette fonction s'exécute quand "data" change

    // Fonction pour gérer le changement des niveaux de compétence
    const handleRadioChange = (niveau, competenceId) => {
        const newValues = initialValues.competenceEvaluations.map(item => {
            if (item.competenceId === competenceId) {
                return { ...item, niveau: item.niveau === niveau ? "" : niveau };
            }
            return item;
        });

        setInitialValues({
            ...initialValues,
            competenceEvaluations: newValues
        });
    };

    const handleFormSubmit = async (values) => {
        try {
            const stageDto = {
                noteScientifique: values.noteScientifique,
                noteIndividu: values.noteIndividu,
                noteEntreprise: values.noteEntreprise,
                stageId: id_stage,
                implicationActivites: values.implicationActivites,
                ouvertureAuxAutres: values.ouvertureAuxAutres,
                qualiteProductions: values.qualiteProductions,
                observationsTravail: values.observationsTravail,
                competenceEvaluations: values.competenceEvaluations,
                competencesSpecifiques: values.competencesSpecifiques
            };
            await updateEvaluation(id_evaluation, stageDto, authTokens?.accessToken);
            navigate('/TuteurDashboard/encadrement');
            enqueueSnackbar('Les modifications ont été enregistrés avec succès!', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(error.message || 'Erreur lors de la modification', { variant: 'error' });
        }
    };


    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Box m="20px">
            <Header
                title={data?.stagiaireNomComplet ? `Évaluer le stagiaire ${data.stagiaireNomComplet}` : 'Évaluation du stagiaire'}
                subtitle={data?.stagiaireNomComplet ? "Mettez à jour les informations de l'évaluation du stage." : "Aucune donnée disponible pour le stagiaire."}
            />            <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                    '& .MuiStepIcon-root': {
                        fontSize: '1.5rem',
                        color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.grey[700],
                        '&.Mui-completed': {
                            color: theme.palette.success.main,
                        },
                        '&.Mui-active': {
                            color: theme.palette.primary.main,
                        },
                    },
                    '& .MuiStepIcon-text': {
                        fill: theme.palette.mode === 'dark' ? '#000' : '#fff', // couleur du chiffre dans le rond
                        fontSize: '1rem',
                        fontWeight: 'bold',
                    },
                    '& .MuiStepLabel-label': {
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: theme.palette.text.primary, // label text
                    },
                    '& .MuiStep-root': {
                        padding: '0 24px',
                    },
                }}
            >
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepButton onClick={() => setActiveStep(index)}>{label}</StepButton>
                    </Step>
                ))}
            </Stepper>
            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={activeStep === steps.length - 1 ? validationSchema : null}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async (values, actions) => {
                    const isEmpty = val => val === undefined || val === null || val === '';

                    if (activeStep === 0) {
                        const requiredFields = [
                            'theme',
                            'objectif',
                            'entreprise',
                            'institution',
                            'dateDebut',
                            'dateFin',
                            'implicationActivites',
                            'ouvertureAuxAutres',
                            'qualiteProductions',
                            'observationsTravail',
                        ];
                        const missingFields = requiredFields.filter(field => isEmpty(values[field]));
                        if (missingFields.length > 0) {
                            enqueueSnackbar(`Tous les champs requis doivent être remplis.`, {
                                variant: 'warning',
                                anchorOrigin: {
                                  vertical: 'bottom',
                                  horizontal: 'right',
                                },
                              });
                            actions.setSubmitting(false);
                            return;
                        }
                    }

                    if (activeStep === 1) {
                        const missing = competencesIndividu.some(
                            comp => !values.competenceEvaluations.find(c => c.competenceId === comp.id && !isEmpty(c.niveau))
                        ) || isEmpty(values.noteIndividu);

                        if (missing) {
                            enqueueSnackbar(`Veuillez évaluer toutes les compétences liées à l'individu et saisir la note.`, {
                                variant: 'warning',
                                anchorOrigin: {
                                  vertical: 'bottom',
                                  horizontal: 'right',
                                },
                              });
                            actions.setSubmitting(false);
                            return;
                        }

                        if (values.noteIndividu < 0 || values.noteIndividu > 20) {
                            enqueueSnackbar(`La note de l'individu doit être entre 0 et 20.`, {
                                variant: 'warning',
                                anchorOrigin: {
                                  vertical: 'bottom',
                                  horizontal: 'right',
                                },
                              });
                            actions.setSubmitting(false);
                            return;
                        }
                    }

                    if (activeStep === 2) {
                        const missing = competencesEntreprise.some(
                            comp => !values.competenceEvaluations.find(c => c.competenceId === comp.id && !isEmpty(c.niveau))
                        ) || isEmpty(values.noteEntreprise);

                        if (missing) {
                            enqueueSnackbar(`Veuillez évaluer toutes les compétences liées à l'entreprise et saisir la note.`, {
                                variant: 'warning',
                                anchorOrigin: {
                                  vertical: 'bottom',
                                  horizontal: 'right',
                                },
                              });
                            actions.setSubmitting(false);
                            return;
                        }

                        if (values.noteEntreprise < 0 || values.noteEntreprise > 20) {
                            enqueueSnackbar(`La note de l'entreprise doit être entre 0 et 20.`, {
                                variant: 'warning',
                                anchorOrigin: {
                                  vertical: 'bottom',
                                  horizontal: 'right',
                                },
                              });
                            actions.setSubmitting(false);
                            return;
                        }
                    }

                    if (activeStep === 3) {
                        const missing = competencesScientifiques.some(
                            comp => !values.competenceEvaluations.find(c => c.competenceId === comp.id && !isEmpty(c.niveau))
                        ) || isEmpty(values.noteScientifique);

                        if (missing) {
                            enqueueSnackbar(`Veuillez évaluer toutes les compétences scientifiques et saisir la note.`, {
                                variant: 'warning',
                                anchorOrigin: {
                                  vertical: 'bottom',
                                  horizontal: 'right',
                                },
                              });
                            actions.setSubmitting(false);
                            return;
                        }

                        if (values.noteScientifique < 0 || values.noteScientifique > 20) {
                            enqueueSnackbar(`La note scientifique doit être entre 0 et 20.`, {
                                variant: 'warning',
                                anchorOrigin: {
                                  vertical: 'bottom',
                                  horizontal: 'right',
                                },
                              });
                            actions.setSubmitting(false);
                            return;
                        }
                    }

                    if (activeStep === 4) {
                        const hasEmpty = values.competencesSpecifiques.some(
                            comp => isEmpty(comp.intitule) || isEmpty(comp.niveau)
                        );

                        if (hasEmpty) {
                            enqueueSnackbar(`Veuillez compléter toutes les compétences spécifiques (intitulé et niveau).`, {
                                variant: 'warning',
                                anchorOrigin: {
                                  vertical: 'bottom',
                                  horizontal: 'right',
                                },
                              });
                            actions.setSubmitting(false);
                            return;
                        }
                    }

                    if (activeStep === steps.length - 1) {
                        try {
                            await handleFormSubmit(values);
                        } catch (error) {
                            console.error("Erreur de soumission finale :", error);
                        }
                        actions.setSubmitting(false);
                    } else {
                        setActiveStep(prev => prev + 1);
                        actions.setTouched({});
                        actions.setSubmitting(false);
                    }
                }}
            >

                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <div>

                            {activeStep === 0 && (
                                <Box mt={4} display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">

                                    {/* Champs non modifiables */}
                                    {["theme", "objectif", "entreprise", "institution"].map(field => (
                                        <TextField
                                            key={field}
                                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                                            name={field}
                                            variant="filled"
                                            value={values[field]}
                                            InputProps={{ readOnly: true }}
                                            sx={{ gridColumn: "span 2" }}
                                        />
                                    ))}
                                    <TextField
                                        label="Date début"
                                        name="dateDebut"
                                        type="date"
                                        variant="filled"
                                        value={values.dateDebut}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{ readOnly: true }}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        label="Date fin"
                                        name="dateFin"
                                        type="date"
                                        variant="filled"
                                        value={values.dateFin}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{ readOnly: true }}
                                        sx={{ gridColumn: "span 2" }}
                                    />


                                    {/* Dropdowns standards */}
                                    <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                                        <InputLabel>Implication dans les activités</InputLabel>
                                        <Select
                                            name="implicationActivites"
                                            value={values.implicationActivites}
                                            onChange={handleChange}
                                            variant="filled"
                                        >
                                            {Object.entries(implicationActivitesLabels).map(([value, label]) => (
                                                <MenuItem key={value} value={value}>{label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                                        <InputLabel>Ouverture aux autres</InputLabel>
                                        <Select
                                            name="ouvertureAuxAutres"
                                            value={values.ouvertureAuxAutres}
                                            onChange={handleChange}
                                            variant="filled"
                                        >
                                            {Object.entries(ouvertureAuxAutresLabels).map(([value, label]) => (
                                                <MenuItem key={value} value={value}>{label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                                        <InputLabel>Qualité des productions</InputLabel>
                                        <Select
                                            name="qualiteProductions"
                                            value={values.qualiteProductions}
                                            onChange={handleChange}
                                            variant="filled"
                                        >
                                            {Object.entries(qualiteProductionsLabels).map(([value, label]) => (
                                                <MenuItem key={value} value={value}>{label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {/* Observations */}
                                    <TextField
                                        label="Observations"
                                        name="observationsTravail"
                                        variant="filled"
                                        multiline
                                        rows={3}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.observationsTravail}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                </Box>
                            )}

                            {activeStep === 1 && (
                                <Box mt={4}>
                                    <div style={{ width: '100%' }}>
                                        <DataGrid
                                            autoHeight
                                            rows={competencesIndividu.map(comp => ({
                                                id: comp.id,
                                                intitule: comp.intitule,
                                                niveau:
                                                    values.competenceEvaluations.find(c => c.competenceId === comp.id)?.niveau || ''
                                            }))}
                                            columns={[
                                                { field: 'intitule', headerName: 'Compétences Individu', flex: 1 },
                                                {
                                                    field: 'niveau',
                                                    headerName: 'Niveau',
                                                    flex: 1.5,
                                                    renderCell: (params) => (
                                                        <RadioGroup
                                                            row
                                                            value={
                                                                values.competenceEvaluations.find(
                                                                    c => c.competenceId === params.row.id
                                                                )?.niveau || ''
                                                            }
                                                            onChange={(e) => {
                                                                const updated = [...values.competenceEvaluations];
                                                                const existing = updated.find(c => c.competenceId === params.row.id);
                                                                const selectedValue = e.target.value;

                                                                if (existing) {
                                                                    existing.niveau = e.target.value;
                                                                } else {
                                                                    updated.push({ competenceId: params.row.id, niveau: e.target.value });
                                                                }
                                                                handleChange({
                                                                    target: {
                                                                        name: 'competenceEvaluations',
                                                                        value: updated
                                                                    }
                                                                });
                                                            }}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                width: '100%'
                                                            }}
                                                        >
                                                            {Object.keys(niveauxCompetenceLabels).map(option => (
                                                                <FormControlLabel
                                                                    key={option}
                                                                    value={option}
                                                                    control={
                                                                        <Radio
                                                                            size="small"
                                                                            sx={{
                                                                                '&.Mui-checked': {
                                                                                    color: 'green',
                                                                                },
                                                                            }}
                                                                        />
                                                                    }
                                                                    label={niveauxCompetenceLabels[option] || option}
                                                                />
                                                            ))}
                                                        </RadioGroup>
                                                    )
                                                }
                                            ]}
                                            pageSize={5}
                                            rowsPerPageOptions={[5]}
                                            disableSelectionOnClick
                                            sx={{
                                                border: 'none',
                                                '& .MuiDataGrid-root': {
                                                    border: 'none',
                                                    boxShadow: 'none',
                                                },
                                                '& .MuiDataGrid-cell': { borderBottom: 'none' },
                                                '& .MuiDataGrid-columnHeaders': {
                                                    backgroundColor: colors.blueAccent[800],
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiDataGrid-virtualScroller': {
                                                    backgroundColor: colors.primary[400],
                                                },
                                                '& .MuiDataGrid-footerContainer': {
                                                    borderTop: 'none',
                                                    backgroundColor: colors.blueAccent[800],
                                                },
                                            }}
                                        />
                                        {/* Titre de la note individu */}
                                        <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
                                            Note pour évaluer les compétences liées à l'individu /20 :
                                        </Typography>

                                        <TextField
                                            fullWidth
                                            label="Note Individu"
                                            name="noteIndividu"
                                            type="number"
                                            variant="filled"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.noteIndividu}
                                            error={!!touched.noteIndividu && !!errors.noteIndividu}
                                            helperText={touched.noteIndividu && errors.noteIndividu}
                                        />
                                    </div>
                                </Box>
                            )}


                            {activeStep === 2 && (
                                <Box mt={4}>
                                    <div style={{ width: '100%' }}>
                                        <DataGrid
                                            m="40px 0 0 0"
                                            autoHeight
                                            sx={{
                                                border: 'none',
                                                '& .MuiDataGrid-root': {
                                                    border: 'none',
                                                    boxShadow: 'none',
                                                },
                                                '& .MuiDataGrid-cell': { borderBottom: 'none' },
                                                '& .MuiDataGrid-columnHeaders': {
                                                    backgroundColor: colors.blueAccent[800],
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiDataGrid-virtualScroller': {
                                                    backgroundColor: colors.primary[400],
                                                },
                                                '& .MuiDataGrid-footerContainer': {
                                                    borderTop: 'none',
                                                    backgroundColor: colors.blueAccent[800],
                                                },
                                            }}
                                            rows={competencesEntreprise.map(comp => ({
                                                id: comp.id,
                                                intitule: comp.intitule,
                                                niveau: values.competenceEvaluations.find(c => c.competenceId === comp.id)?.niveau || ''
                                            }))}
                                            columns={[
                                                { field: 'intitule', headerName: 'Compétences Entreprise', flex: 1 },
                                                {
                                                    field: 'niveau',
                                                    headerName: 'Niveau',
                                                    flex: 1.5,
                                                    renderCell: (params) => (
                                                        <RadioGroup
                                                            row
                                                            value={values.competenceEvaluations.find(c => c.competenceId === params.row.id)?.niveau || ''}
                                                            onChange={(e) => {
                                                                const updated = [...values.competenceEvaluations];
                                                                const existing = updated.find(c => c.competenceId === params.row.id);
                                                                if (existing) {
                                                                    existing.niveau = e.target.value;
                                                                } else {
                                                                    updated.push({ competenceId: params.row.id, niveau: e.target.value });
                                                                }
                                                                handleChange({
                                                                    target: {
                                                                        name: 'competenceEvaluations',
                                                                        value: updated
                                                                    }
                                                                });
                                                            }}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                width: '100%'
                                                            }}
                                                        >
                                                            {Object.keys(niveauxCompetenceLabels).map(key => (
                                                                <FormControlLabel
                                                                    key={key}
                                                                    value={key}
                                                                    control={<Radio size="small"
                                                                        sx={{
                                                                            '&.Mui-checked': {
                                                                                color: 'green',
                                                                            },
                                                                        }} />}
                                                                    label={niveauxCompetenceLabels[key]}
                                                                />
                                                            ))}
                                                        </RadioGroup>
                                                    )
                                                }
                                            ]}
                                            pageSize={5}
                                            rowsPerPageOptions={[5]}
                                            disableSelectionOnClick
                                        />
                                        {/* Titre de la note entreprise */}
                                        <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
                                            Note pour évaluer les compétences liées à l'entreprise /20 :
                                        </Typography>

                                        <TextField
                                            fullWidth
                                            label="Note Entreprise"
                                            name="noteEntreprise"
                                            type="number"
                                            variant="filled"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.noteEntreprise}
                                            error={!!touched.noteEntreprise && !!errors.noteEntreprise}
                                            helperText={touched.noteEntreprise && errors.noteEntreprise}
                                        />
                                    </div>
                                </Box>
                            )}

                            {activeStep === 3 && (
                                <Box mt={4}>
                                    <div style={{ width: '100%' }}>
                                        <DataGrid
                                            autoHeight
                                            sx={{
                                                border: 'none',
                                                '& .MuiDataGrid-root': { border: 'none', boxShadow: 'none' },
                                                '& .MuiDataGrid-cell': { borderBottom: 'none' },
                                                '& .MuiDataGrid-columnHeaders': {
                                                    backgroundColor: colors.blueAccent[800],
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiDataGrid-virtualScroller': {
                                                    backgroundColor: colors.primary[400],
                                                },
                                                '& .MuiDataGrid-footerContainer': {
                                                    borderTop: 'none',
                                                    backgroundColor: colors.blueAccent[800],
                                                },
                                            }}
                                            rows={competencesScientifiques.map(comp => ({
                                                id: comp.id,
                                                intitule: comp.intitule,
                                                niveau: values.competenceEvaluations.find(c => c.competenceId === comp.id)?.niveau || ''
                                            }))}
                                            columns={[
                                                { field: 'intitule', headerName: 'Compétences Scientifiques', flex: 1 },
                                                {
                                                    field: 'niveau',
                                                    headerName: 'Niveau',
                                                    flex: 1.5,
                                                    renderCell: (params) => (
                                                        <RadioGroup
                                                            row
                                                            value={
                                                                values.competenceEvaluations.find(c => c.competenceId === params.row.id)?.niveau || ''
                                                            }
                                                            onChange={(e) => {
                                                                const updated = [...values.competenceEvaluations];
                                                                const existing = updated.find(c => c.competenceId === params.row.id);
                                                                if (existing) {
                                                                    existing.niveau = e.target.value;
                                                                } else {
                                                                    updated.push({ competenceId: params.row.id, niveau: e.target.value });
                                                                }
                                                                handleChange({
                                                                    target: {
                                                                        name: 'competenceEvaluations',
                                                                        value: updated
                                                                    }
                                                                });
                                                            }}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                width: '100%'
                                                            }}
                                                        >
                                                            {Object.keys(niveauxCompetenceLabels).map(key => (
                                                                <FormControlLabel
                                                                    key={key}
                                                                    value={key}
                                                                    control={
                                                                        <Radio
                                                                            size="small"
                                                                            sx={{
                                                                                '&.Mui-checked': { color: 'green' }
                                                                            }}
                                                                        />
                                                                    }
                                                                    label={niveauxCompetenceLabels[key]}
                                                                />
                                                            ))}
                                                        </RadioGroup>
                                                    )
                                                }
                                            ]}
                                            pageSize={5}
                                            rowsPerPageOptions={[5]}
                                            disableSelectionOnClick
                                        />

                                        {/* Titre de la note scientifique */}
                                        <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
                                            Note pour évaluer les compétences Scientifiques /20 :
                                        </Typography>

                                        {/* Champ de note scientifique pleine largeur */}
                                        <TextField
                                            fullWidth
                                            label="Note Scientifique"
                                            name="noteScientifique"
                                            type="number"
                                            variant="filled"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.noteScientifique}
                                            error={!!touched.noteScientifique && !!errors.noteScientifique}
                                            helperText={touched.noteScientifique && errors.noteScientifique}
                                        />
                                    </div>
                                </Box>
                            )}

                            {activeStep === 4 && (
                                <Box mt={4} display="flex" flexDirection="column" gap="20px" width="100%">
                                    <Box display="flex" justifyContent="center">
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                setFieldValue("competencesSpecifiques", [
                                                    ...values.competencesSpecifiques,
                                                    { intitule: "", niveau: "" }
                                                ])
                                            }
                                        >
                                            Ajouter une compétence
                                        </Button>
                                    </Box>

                                    {values.competencesSpecifiques.map((competence, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap="20px" width="100%">
                                            <TextField
                                                label="Compétence"
                                                variant="filled"
                                                value={competence.intitule}
                                                onChange={(e) => {
                                                    const updated = [...values.competencesSpecifiques];
                                                    updated[index].intitule = e.target.value;
                                                    setFieldValue("competencesSpecifiques", updated);
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                                sx={{ flex: 1 }}
                                            />
                                            <FormControl variant="filled" sx={{ flex: 1 }}>
                                                <InputLabel>Niveau</InputLabel>
                                                <Select
                                                    value={competence.niveau}
                                                    onChange={(e) => {
                                                        const updated = [...values.competencesSpecifiques];
                                                        updated[index].niveau = e.target.value;
                                                        setFieldValue("competencesSpecifiques", updated);
                                                    }}
                                                >
                                                    {Object.entries(niveauxCompetenceMetierLabels).map(([value, label]) => (
                                                        <MenuItem key={value} value={value}>{label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <IconButton
                                                color="error"
                                                onClick={() => {
                                                    const updated = values.competencesSpecifiques.filter((_, i) => i !== index);
                                                    setFieldValue("competencesSpecifiques", updated);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )}

                        </div>

                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                            {activeStep > 0 && (
                                <Button onClick={handleBack} color="inherit"
                                    variant="outlined">
                                    Retour
                                </Button>
                            )}

                            <Button
                                type="submit"
                                variant="contained" color="secondary"
                                disabled={isSubmitting}
                            >
                                {activeStep === steps.length - 1 ? 'Soumettre' : 'Suivant'}
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};



const validationSchema = yup.object().shape({
    noteScientifique: yup.number().min(0).max(20).required("Requis"),
    noteIndividu: yup.number().min(0).max(20).required("Requis"),
    noteEntreprise: yup.number().min(0).max(20).required("Requis"),
    implicationActivites: yup.string().required("Ce champ est requis"),
    ouvertureAuxAutres: yup.string().required("Ce champ est requis"),
    qualiteProductions: yup.string().required("Ce champ est requis"),
    observationsTravail: yup.string().required("Ce champ est requis"),
});

export default EvaluationUpdateForm;