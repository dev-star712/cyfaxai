import useDetailReport from "@/views/current-risk/hooks/useDetailReport";
import { FormattedMessage } from "react-intl";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function Chart() {
  const { chartData, totalSecurityIssuesFound } = useDetailReport();
  return (
    <div className="flex grow justify-center">
      <div className="relative size-[185px]">
        <ResponsiveContainer className={"scale-125"}>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={0}
              dataKey="count"
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={_entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 m-auto flex items-center text-center">
          <div className="w-full">
            <p className="text-xl font-semibold">{totalSecurityIssuesFound}</p>
            <p className="mt-3 text-xs font-medium">
              <FormattedMessage id="securityFindings" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
