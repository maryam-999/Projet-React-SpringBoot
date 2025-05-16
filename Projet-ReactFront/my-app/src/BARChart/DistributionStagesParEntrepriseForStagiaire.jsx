import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import React, { useEffect, useState, useContext } from "react";
import { getStagiaireStatistics } from "../utils/api";
import AuthContext from "../context/AuthContext";

const DistributionStageParEntreprise = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const { authTokens, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStagiaireStatistics(authTokens?.accessToken, user.id);
        const stagesParEntreprise = response.stagesParEntreprise || {}; // Changement pour stagesParEntreprise
        const formattedData = Object.entries(stagesParEntreprise).map(
          ([entreprise, Nombre]) => ({
            entreprise,
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
      indexBy="entreprise"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.8}
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
        legend: "Entreprises",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Nombre de stages",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      role="application"
      ariaLabel="Bar chart vertical - Stages par entreprise"
      barAriaLabel={(e) => `${e.indexValue}: ${e.value}`}
      tooltip={CustomTooltip}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      
    />
  );
};

export default DistributionStageParEntreprise;
