import { MXToolboxCategory } from "@/types/api-responses/detail-report";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

function convertSecurityReport(report: MXToolboxCategory) {
  const resultArray: {
    securityAspect: string;
    host: string;
    result: string;
  }[] = [];

  for (const aspect in report) {
    if (report.hasOwnProperty(aspect)) {
      report[aspect].forEach((item: any) => {
        resultArray.push({
          securityAspect: aspect,
          host: item.host,
          result: item.result,
        });
      });
    }
  }

  return resultArray;
}

const EmailProtectionResultsTable = ({ data }: { data: MXToolboxCategory }) => {
  const rows = useMemo(() => convertSecurityReport(data), [data]);
  return (
    <>
      <table className="w-full max-lg:hidden">
        <thead>
          <tr className="bg-[#60605B]/[.07] [&>th]:py-3.5 [&>th]:pl-6 [&>th]:text-left [&>th]:font-mulish [&>th]:font-semibold">
            <th>
              <FormattedMessage id="securityAspect" />
            </th>
            <th>
              <FormattedMessage id="host" />
            </th>
            <th>
              <FormattedMessage id="explanation" />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows?.slice(0, 3)?.map((row, i) => {
            return (
              <tr
                key={i}
                className="[&>td]:border-b [&>td]:py-4 [&>td]:pl-6 [&>td]:font-mulish [&>td]:text-sm"
              >
                <td>{row.securityAspect}</td>
                <td>{row.host}</td>
                <td>{row.result}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="grid grid-cols-1 gap-3 font-mulish md:grid-cols-2 lg:hidden">
        {rows.map((row, i) => (
          <div
            key={i}
            className="rounded-lg p-3 shadow-[0_0_12px_rgba(0,0,0,0.12)]"
          >
            <div className="grid grid-cols-[1fr,1px,1fr] items-center gap-5">
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.2px]">
                  <FormattedMessage id="securityAspect" />
                </p>
                <span className="mt-2.5 text-xs">{row?.securityAspect}</span>
              </div>
              <span className="h-3.5 border-r border-black/20"></span>
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.2px]">
                  <FormattedMessage id="host" />
                </p>
                <span className="mt-2.5 text-xs">{row?.host}</span>
              </div>
            </div>

            <hr className="my-2.5 border-t border-black/20" />

            <div className="grid grid-cols-1 items-center gap-5">
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.2px]">
                  <FormattedMessage id="explanation" />
                </p>
                <span className="mt-2.5 text-xs">{row?.result}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EmailProtectionResultsTable;
