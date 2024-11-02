import { DNSTwistItem } from "@/types/api-responses/detail-report";
import { FormattedMessage } from "react-intl";

const CompanyDomainNameVariationTable = ({
  rows,
}: {
  rows: DNSTwistItem[];
}) => {
  return (
    <>
    <div className="overflow-x-auto">
      <table className="w-full max-lg:hidden">
        <thead>
          <tr className="bg-[#60605B]/[.07] [&>th]:py-3.5 [&>th]:pl-6 [&>th]:text-left [&>th]:font-mulish [&>th]:font-semibold">
            <th>
              <FormattedMessage id="fuzzerType" />
            </th>
            <th>
              <FormattedMessage id="domainVariation" />
            </th>
            <th>
              <FormattedMessage id="dNSNameserver" />
            </th>
            <th>
              <FormattedMessage id="iPAddress" />
            </th>
            <th>
              <FormattedMessage id="webTechnology" />
            </th>
            <th>
              <FormattedMessage id="uRLScheme" />
            </th>
            <th>
              <FormattedMessage id="titleAndContentDescription" />
            </th>
            <th>
              <FormattedMessage id="takedownRequest" />
            </th>
          </tr>
        </thead>
        <tbody>
          {(rows || []).slice(0, 3)?.map((row, i) => {
            return (
              <tr
                key={i}
                className="[&>td]:border-b [&>td]:py-4 [&>td]:pl-6 [&>td]:font-mulish [&>td]:text-sm"
              >
                <td>{row?.fuzzer}</td>
                <td>{row?.domain}</td>
                <td>{row?.dns_ns?.join(", ")}</td>
                <td>{row?.dns_a?.join(", ")}</td>
                <td>{row?.tech?.join(", ")}</td>
                <td>{row?.scheme}</td>
                <td>{row?.title || "-"}</td>
                <td>  
                  <button type="button" className="mt-4 rounded border border-gray-300 px-4 py-2 text-sm leading-none text-gray-800 hover:border-transparent hover:bg-[#720072] hover:text-white lg:mt-0">  
                    Request  
                  </button>
                </td>  
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
                  <FormattedMessage id="fuzzerType" />
                </p>
                <span className="mt-2.5 text-xs">{row?.fuzzer}</span>
              </div>
              <span className="h-3.5 border-r border-black/20"></span>
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.2px]">
                  <FormattedMessage id="domainVariation" />
                </p>
                <span className="mt-2.5 text-xs">{row?.domain}</span>
              </div>
            </div>

            <hr className="my-2.5 border-t border-black/20" />

            <div className="grid grid-cols-[1fr,1px,1fr] items-center gap-5">
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.2px]">
                  <FormattedMessage id="dNSNameserver" />
                </p>
                <span className="mt-2.5 text-xs">
                  {row?.dns_ns?.join(", ")}
                </span>
              </div>
              <span className="h-3.5 border-r border-black/20"></span>
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.2px]">
                  <FormattedMessage id="iPAddress" />
                </p>
                <span className="mt-2.5 text-xs">{row?.dns_a?.join(", ")}</span>
              </div>
            </div>
            <hr className="my-2.5 border-t border-black/20" />

            <div className="grid grid-cols-[1fr,1px,1fr] items-center gap-5">
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.2px]">
                  <FormattedMessage id="webTechnology" />
                </p>
                <span className="mt-2.5 text-xs">{row?.tech?.join(", ")}</span>
              </div>
              <span className="h-3.5 border-r border-black/20"></span>
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.2px]">
                  <FormattedMessage id="uRLScheme" />
                </p>
                <span className="mt-2.5 text-xs capitalize">{row?.scheme}</span>
              </div>
            </div>
            <hr className="my-2.5 border-t border-black/20" />

            <div className="grid grid-cols-[1fr,1px,1fr] items-center gap-5">
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.2px]">
                  <FormattedMessage id="titleAndContentDescription" />
                </p>
                <span className="mt-2.5 text-xs capitalize">
                  {row?.title || "-"}
                </span>
              </div>
              <span className="h-3.5 border-r border-black/20"></span>
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.2px]">
                  <FormattedMessage id="takedownRequest" />
                </p>
                <button type="button" className="mt-4 rounded border border-gray-300 px-4 py-2 text-sm leading-none text-gray-800 hover:border-transparent hover:bg-[#720072] hover:text-white lg:mt-0">  
                    Request  
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default CompanyDomainNameVariationTable;
