import IconCra from "@/components/icons/icon-cra";
import { getDownloadPDFMutationOptions } from "@/cyfax-api-client/mutations";
import { getPDFReportsQueryOptions } from "@/cyfax-api-client/queries";
import { cn, downloadPDF, getApiErrorMessage } from "@/lib/utils";
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";

const AssessmentReport = () => {
  const { domain } = useDetailReport();

  const PDFReportsQuery = useQuery({
    ...getPDFReportsQueryOptions(),
  });

  const downloadPDFMutationOptions = useMutation({
    ...getDownloadPDFMutationOptions(),
    onSuccess(data, variables) {
      downloadPDF(data.data, variables.file_path);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const pdfReport = useMemo(
    () =>
      PDFReportsQuery.data?.data.find(
        (report) => report.domain_name === domain,
      ),
    [PDFReportsQuery.data?.data, domain],
  );

  return (
    <div className="mt-5 rounded-lg p-3 shadow-[0_0_12px_rgba(0,0,0,0.12)] sm:rounded-xl sm:p-5">
      <div className="mx-auto grid w-fit gap-x-[177px] xl:grid-cols-[235px,528px]">
        <Image
          src={"/site-logo.png"}
          alt="Cyfax"
          width={470}
          height={594}
          className="max-xl:mx-auto max-xl:max-w-28 max-lg:max-w-20 max-md:max-w-12"
        />
        <div className="max-xl:mt-3.5">
          <h3 className="text-[15px] font-medium sm:text-xl lg:text-2xl">
            <FormattedMessage id="assessmentTitle" />
          </h3>
          <p className="mb-5 mt-4 max-sm:text-xs max-sm:tracking-[-0.3px]">
            <FormattedMessage id="assessmentDescription" />
          </p>
          <div className="grid grid-cols-2 gap-x-2 md:gap-x-6">
            <div>
              <button
                disabled={
                  downloadPDFMutationOptions.isPending || !pdfReport?.file_path
                }
                onClick={() => {
                  if (!pdfReport?.file_path) return;

                  downloadPDFMutationOptions.mutate({
                    file_path: pdfReport?.file_path,
                  });
                }}
                className={cn(
                  "flex h-12 w-full items-center justify-center gap-x-2 rounded-md bg-[#720072] px-5 text-[11px] font-medium text-white max-md:tracking-[0.3px] sm:text-base/[150%] md:gap-x-5 md:rounded-lg md:px-[34px] md:font-semibold",
                  !pdfReport?.file_path &&
                    "disabled:opacity-60 cursor-not-allowed",
                )}
              >
                {downloadPDFMutationOptions.isPending ? (
                  <FormattedMessage id="pleaseWait" />
                ) : (
                  <>
                    <span className="shrink-0">
                      <FormattedMessage id="downloadReport" />
                    </span>
                    <IconCra className="w-[18px] shrink-0 text-white md:w-[25px]" />
                  </>
                )}
              </button>
              <p className="mt-4 text-center text-[11px] font-medium sm:text-lg md:text-xl">
                <FormattedMessage id="eXECUTIVESNAPSHOT" />
              </p>
            </div>
            <div>
              <button
                disabled
                className="flex h-12 w-full items-center justify-center gap-x-2 rounded-md bg-[#720072] px-5 disabled:cursor-not-allowed disabled:opacity-60 md:gap-x-5 md:rounded-lg md:px-[34px]"
              >
                <span className="shrink-0 text-[10px] font-medium text-white max-md:tracking-[0.3px] sm:text-base/[150%] md:font-semibold">
                  <FormattedMessage id="downloadReport" />
                </span>
                <IconCra className="w-[18px] shrink-0 text-white md:w-[25px]" />
              </button>
              <p className="mt-4 text-center text-[10px] font-medium sm:text-lg md:text-xl">
                <FormattedMessage id="dETAILEDXTIREPORT" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentReport;
