import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import React, { useEffect, useState, useContext } from "react";
import { getStagiaireStatistics } from "../utils/api";
import AuthContext from "../context/AuthContext";

const DistributionStageParTuteurForStagiaire = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const { authTokens, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStagiaireStatistics(authTokens?.accessToken, user.id);
        const stagesParTuteur = response.stagesParTuteur || {};
        const formattedData = Object.entries(stagesParTuteur).map(
          ([tuteur, Nombre]) => ({
            tuteur,
            Nombre,
          })
        );
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data || data.length === 0) return null;

  const CustomTooltip = ({ id, value, indexValue }) => (
    <div
      style={{
        background: colors.grey[100],
        padding: "8px",
        borderRadius: "4px",
      }}
    >
      <strong style={{ color: colors.grey[700] }}>
        {indexValue} : {value}
      </strong>
    </div>
  );

  return (
    <ResponsiveBar
      data={data}
      layout="horizontal"
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey[100] } },
          legend: { text: { fill: colors.grey[100] } },
          ticks: {
            line: { stroke: colors.grey[100], strokeWidth: 1 },
            text: { fill: colors.grey[100] },
          },
        },
        legends: {
          text: { fill: colors.grey[100] },
        },
      }}
      keys={["Nombre"]}
      indexBy="tuteur"
      margin={{ top: 40, right: 30, bottom: 40, left: 150 }}
      padding={0.4}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      colorBy="indexValue"
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Nombre de stages",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Tuteurs",
        legendPosition: "middle",
        legendOffset: -120,
      }}
      enableLabel={true}
      labelSkipWidth={100}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      role="application"
      ariaLabel="Bar chart horizontal - Stages par tuteur"
      barAriaLabel={(e) => `${e.indexValue}: ${e.value}`}
      tooltip={CustomTooltip}
    />
  );
};

export default DistributionStageParTuteurForStagiaire;
