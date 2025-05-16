import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Formik } from "formik";
import React, { useEffect, useState, useContext } from "react";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { getStagiaireById, updateStagiaire } from "../../utils/api";
import { useSnackbar } from 'notistack';



const FormStagiaire = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id: id_stagiaire } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [stagiaireData, setStagiaireData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();


  const handleFormSubmit = async (values) => {
    try {
      await updateStagiaire(id_stagiaire, values, authTokens?.accessToken);
      enqueueSnackbar('Les modifications apportées au stagiaire ont été enregistrées avec succès!', { variant: 'success' });
    } catch (error) {
      if (error.message) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('Une erreur s\'est produite lors de la mise à jour du stagiaire.', { variant: 'error' });
      }
    }
  };



  useEffect(() => {
    getStagiaireById(id_stagiaire, authTokens?.accessToken)
      .then((data) => setStagiaireData(data))
      .catch((error) => console.log(error));
  }, [id_stagiaire, authTokens?.accessToken]);



  const initialValues = {
    nom: '',
    prenom: '',
    email: '',
    role: '',
    institution: '',
    entreprise: '',
    password: '',
  };

  return (
    <Box m="20px">
      <Header title="Modifier les informations du stagiaire" subtitle="Transformez le compte du stagiaire avec des informations à jour !" />
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
            if (stagiaireData) {
              const { nom, prenom, email, role, institution, entreprise } = stagiaireData;
              setFieldValue("nom", nom || "");
              setFieldValue("prenom", prenom || "");
              setFieldValue("email", email || "");
              setFieldValue("role", role || "");
              setFieldValue("institution", institution || "");
              setFieldValue("entreprise", entreprise || "");
            }
          }, [stagiaireData, setFieldValue]);
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
                  label="Nom"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.nom}
                  name="nom"
                  error={!!touched.nom && !!errors.nom}
                  helperText={touched.nom && errors.nom}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Prénom"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.prenom}
                  name="prenom"
                  error={!!touched.prenom && !!errors.prenom}
                  helperText={touched.prenom && errors.prenom}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="E-mail"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Mot de passe"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
                <FormControl fullWidth sx={{ gridColumn: "span 4" }} variant="filled">
                  <InputLabel id="role-select">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    value={values.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="role"
                    error={!!touched.role && !!errors.role}
                    helpertext={touched.role && errors.role}
                  >
                    <MenuItem value="" disabled>
                      Choisissez un role
                    </MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="TUTEUR">Tuteur</MenuItem>
                    <MenuItem value="STAGIAIRE">Stagiaire</MenuItem>
                  </Select>
                </FormControl>
                {values.role === "TUTEUR" && (
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Entreprise"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.entreprise}
                    name="entreprise"
                    error={!!touched.entreprise && !!errors.entreprise}
                    helperText={touched.entreprise && errors.entreprise}
                    sx={{ gridColumn: "span 4" }}
                  />
                )}

                {values.role === "STAGIAIRE" && (
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Institution"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.institution}
                    name="institution"
                    error={!!touched.institution && !!errors.institution}
                    helperText={touched.institution && errors.institution}
                    sx={{ gridColumn: "span 4" }}
                  />
                )}

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
  nom: yup.string().required("Requis"),
  prenom: yup.string().required("Requis"),
  email: yup.string().email().required("Requis"),
  entreprise: yup.string().when("role", {
    is: "TUTEUR",
    then: (schema) => schema.required("Requis pour le tuteur"),
    otherwise: (schema) => schema.notRequired(),
  }),
  institution: yup.string().when("role", {
    is: "STAGIAIRE",
    then: (schema) => schema.required("Requis pour le stagiaire"),
    otherwise: (schema) => schema.notRequired(),
  }),
  role: yup.string().required("Requis"),
  password: yup.string()
    .required("Requis")
    .min(8, "Le mot de passe est trop court - il doit contenir au moins 8 caractères!"),
});



export default FormStagiaire;