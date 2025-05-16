import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import saveAs from "file-saver";

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

// Fonction fallback pour les valeurs nulles ou indéfinies
const fallback = (val) => val ?? "-";

// Exporte une fiche d'évaluation Word avec les données fournies.
const exportWordFile = (data) => {
  if (!data) return;

  const templatePath = "/WordTemplate.docx";
  const xhr = new XMLHttpRequest();
  xhr.open("GET", templatePath, true);
  xhr.responseType = "arraybuffer";

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const content = new Uint8Array(xhr.response);
        const zip = new PizZip(content);
        const doc = new Docxtemplater().loadZip(zip);

        // Mapper et trier les niveaux des compétences générales
        const niveaux = {};

        const evaluations = (data.competenceEvaluationsArray || [])
          .slice()
          .sort((a, b) => a.competenceId - b.competenceId);

        evaluations.forEach((item, index) => {
          if (!item || !item.niveau) return;

          const code = item.niveau.trim().toUpperCase();
          const label = niveauxCompetenceLabels[code] || "-";

          niveaux[`niveau${index}`] = label;
        });

        // Mapper les niveaux des compétences spécifiques (métier)
        const competenceSpecifiques = [];
        (data.competenceSpecifiquesArray || []).forEach((item, index) => {
          if (!item || !item.niveau) return;

          const code = item.niveau;
          const label = niveauxCompetenceMetierLabels[code] || "-";
          competenceSpecifiques.push({
            niveau: label,
            intitule: fallback(item.intitule)
          });
        });


        // Champs simples (avec labels lisibles ou fallback)
        const safeData = {
          ...data,
          implicationActivites: implicationActivitesLabels[data.implicationActivites] || "-",
          ouvertureAuxAutres: ouvertureAuxAutresLabels[data.ouvertureAuxAutres] || "-",
          qualiteProductions: qualiteProductionsLabels[data.qualiteProductions] || "-",
          observationsTravail: fallback(data.observationsTravail),
          noteEntreprise: fallback(data.noteEntreprise),
          noteIndividu: fallback(data.noteIndividu),
          noteScientifique: fallback(data.noteScientifique),
          entreprise: fallback(data.entreprise),
          theme: fallback(data.theme),
          objectif: fallback(data.objectif),
          stagiaireNomComplet: fallback(data.stagiaireNomComplet),
          tuteurNomComplet: fallback(data.tuteurNomComplet),
          dateDebut: fallback(data.dateDebut),
          dateFin: fallback(data.dateFin)
        };

        
        // Injection dans le template
        doc.setData({
          ...safeData,
          ...niveaux,
          competenceSpecifiquesArray: competenceSpecifiques,
          dateGeneration: new Date().toLocaleDateString('fr-FR'),
          note: " Ce document est généré automatiquement. Ne pas modifier.",
        });

        doc.render();

        // Générer le fichier et le sauvegarder
        const out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        console.log("Données brutes compétences générales :", data.competenceEvaluationsArray);
        console.log("Données brutes compétences spécifiques :", data.competenceSpecifiquesArray);

        console.log(niveaux);

        saveAs(out, "FicheEvaluation.docx");
      } catch (error) {
        console.error("Erreur de génération du document Word :", error);
        alert("Une erreur est survenue lors de la génération.");
      }
    } else {
      alert("Échec du chargement du modèle Word.");
    }
  };

  xhr.send();
};

export default exportWordFile;
