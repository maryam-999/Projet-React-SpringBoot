import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Formik } from "formik";
import React, { useEffect, useState, useContext } from "react";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { getStageById, updateStage, getTuteursByEntreprise, getAllStagiaires } from "../../utils/api";
import { useSnackbar } from 'notistack';

const FormStage = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { id: id_stage } = useParams();
    const { authTokens } = useContext(AuthContext);
    const [tuteurData, setTuteurData] = useState(null);
    const [tuteurs, setTuteurs] = useState([]);
    const [stagiaires, setStagiaires] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const handleFormSubmit = async (values) => {
        try {
            const stageDto = {
                theme: values.theme,
                objectif: values.objectif,
                entreprise: values.entreprise,
                dateDebut: values.dateDebut,
                dateFin: values.dateFin,
                tuteurId: values.tuteurId,
                stagiaireId: values.stagiaireId,
            };
            await updateStage(id_stage, stageDto, authTokens?.accessToken);
            enqueueSnackbar('Les modifications apportées au stage ont été enregistrées avec succès!', { variant: 'success' });
        } catch (error) {
            if (error.message) {
                enqueueSnackbar(error.message, { variant: 'error' });
            } else {
                enqueueSnackbar('Une erreur s\'est produite lors de la mise à jour du stage.', { variant: 'error' });
            }
        }
    };

    useEffect(() => {
        getStageById(id_stage, authTokens?.accessToken)
            .then((data) => {
                setTuteurData(data);
                fetchTuteurs(data.entreprise);
            })
            .catch((error) => console.log(error));

        getAllStagiaires(authTokens?.accessToken)
            .then((data) => setStagiaires(data))
            .catch((error) => console.log(error));
    }, [id_stage, authTokens?.accessToken]);

    const fetchTuteurs = (entreprise) => {
        getTuteursByEntreprise(authTokens?.accessToken, entreprise)
            .then((data) => setTuteurs(data))
            .catch((error) => console.log(error));
    };

    const initialValues = {
        theme: '',
        objectif: '',
        entreprise: '',
        dateDebut: '',
        dateFin: '',
        tuteurId: '',
        stagiaireId: '',
    };

    return (
        <Box m="20px">
            <Header title="Modifier les informations du stage" subtitle="Mettez à jour les détails du stage !" />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                }) => {
                    useEffect(() => {
                        if (tuteurData) {
                            const { theme, objectif, entreprise, dateDebut, dateFin, tuteur, stagiaire } = tuteurData;
                            setFieldValue("theme", theme || "");
                            setFieldValue("objectif", objectif || "");
                            setFieldValue("entreprise", entreprise || "");
                            setFieldValue("dateDebut", dateDebut || "");
                            setFieldValue("dateFin", dateFin || "");
                            setFieldValue("tuteurId", tuteur?.id || "");
                            setFieldValue("stagiaireId", stagiaire?.id || "");
                        }
                    }, [tuteurData, setFieldValue]);

                    return (
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Theme"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.theme}
                                    name="theme"
                                    error={!!touched.theme && !!errors.theme}
                                    helperText={touched.theme && errors.theme}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Objectif"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.objectif}
                                    name="objectif"
                                    error={!!touched.objectif && !!errors.objectif}
                                    helperText={touched.objectif && errors.objectif}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Entreprise"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        fetchTuteurs(e.target.value);
                                    }}
                                    value={values.entreprise}
                                    name="entreprise"
                                    error={!!touched.entreprise && !!errors.entreprise}
                                    helperText={touched.entreprise && errors.entreprise}
                                    sx={{ gridColumn: "span 4" }}
                                />

                                <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                                    <InputLabel id="tuteurId-label">Tuteur</InputLabel>
                                    <Select
                                        labelId="tuteurId-label"
                                        name="tuteurId"
                                        value={values.tuteurId}
                                        onChange={handleChange}
                                    >
                                        {tuteurs.map((tuteur) => (
                                            <MenuItem key={tuteur.id} value={tuteur.id}>
                                                {tuteur.nom} {tuteur.prenom} ({tuteur.entreprise})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                                    <InputLabel id="stagiaireId-label">Stagiaire</InputLabel>
                                    <Select
                                        labelId="stagiaireId-label"
                                        name="stagiaireId"
                                        value={values.stagiaireId}
                                        onChange={handleChange}
                                    >
                                        {stagiaires.map((stagiaire) => (
                                            <MenuItem key={stagiaire.id} value={stagiaire.id}>
                                                {stagiaire.nom} {stagiaire.prenom}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="date"
                                    label="Date de debut"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.dateDebut}
                                    name="dateDebut"
                                    error={!!touched.dateDebut && !!errors.dateDebut}
                                    helperText={touched.dateDebut && errors.dateDebut}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="date"
                                    label="Date de fin"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.dateFin}
                                    name="dateFin"
                                    error={!!touched.dateFin && !!errors.dateFin}
                                    helperText={touched.dateFin && errors.dateFin}
                                    sx={{ gridColumn: "span 4" }}
                                />
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Modifier
                                </Button>
                            </Box>
                        </form>
                    );
                }}
            </Formik>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    theme: yup.string().required("Requis"),
    objectif: yup.string().required("Requis"),
    entreprise: yup.string().required("Requis"),
    dateDebut: yup
        .date()
        .typeError("Date de début invalide")
        .required("Requis"),
    dateFin: yup
        .date()
        .typeError("Date de fin invalide")
        .required("Requis")
        .min(
            yup.ref('dateDebut'),
            "La date de fin doit être postérieure à la date de début"
        ),
    tuteurId: yup.number().required("Requis"),
    stagiaireId: yup.number().required("Requis"),
});

export default FormStage;
