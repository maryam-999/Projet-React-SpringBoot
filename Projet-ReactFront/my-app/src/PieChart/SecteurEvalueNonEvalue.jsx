import { ResponsivePie } from "@nivo/pie";
import { useEffect, useState, useContext } from "react";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { getStagiaireStatistics } from "../utils/api";
import AuthContext from "../context/AuthContext";

const SecteurEvalueNonEvalue = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const { authTokens, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStagiaireStatistics(authTokens?.accessToken, user.id);
        
        const formattedData = [
          {
            id: "Évalués",
            label: "Évalués",
            value: response.stagesEvalues,
          },
          {
            id: "Non Évalués",
            label: "Non Évalués",
            value: response.stagesNonEvalues,
          },
        ];

        setData(formattedData);
      } catch (error) {
        console.log("Erreur de récupération :", error);
      }
    };

    fetchData();
  }, [authTokens, user.id]);

  return (
    <ResponsivePie
      data={data}
      tooltip={({ datum }) => (
        <div>
          <strong>{datum.label}</strong>
          <br />
          Stages : {datum.value}
        </div>
      )}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          translateY: 56,
          itemWidth: 100,
          itemHeight: 18,
          itemsSpacing: 30,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default SecteurEvalueNonEvalue;
