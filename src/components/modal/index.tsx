import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getRequestReportMutationOptions } from "@/cyfax-api-client/mutations";
import { getApiErrorMessage, isValidEmailForPublicReport } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import modalImg from "../../../public/modal-bg.jpg";

const Modal = ({ children }: { children: ReactNode }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const domain = router.query.domain as string;

  const intl = useIntl();

  const requestReportMutation = useMutation({
    ...getRequestReportMutationOptions(),
    onSuccess(data) {
      toast.success(data.data.data);
      setIsOpenModal(false);
    },
    onError(error) {
      toast.error(getApiErrorMessage(error));
    },
  });

  return (
    <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full overflow-y-auto md:w-4/5 lg:w-8/12 xl:w-6/12">
        <div className="">
          <div className="flex flex-row items-center gap-x-5">
            <Image
              className="w-48 md:w-72 lg:w-80"
              src={modalImg}
              width={893}
              height={1263}
              alt="modal-bg"
            ></Image>
            <div className="p-2">
              <Image
                src={"/cloud-icon.png"}
                alt="Cloud"
                width={100}
                height={100}
                className="mb-4 lg:mx-auto"
              />
              <h2 className="mb-2 font-mulish text-xl font-bold text-black md:mb-3 md:font-extrabold lg:mb-4 lg:text-2xl">
                <FormattedMessage id="modalTitle" />
              </h2>
              <p className="hidden font-mulish text-sm font-bold text-black md:block lg:text-base">
                <FormattedMessage id="modalDescription" />
              </p>
            </div>
          </div>
          <p className="mt-3 block font-mulish text-sm font-bold text-black md:hidden lg:text-base">
            <FormattedMessage id="modalDescription" />
          </p>

          <div className="mx-auto w-11/12 md:w-5/6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setErrorMessage(null);

                const formData = new FormData(e.currentTarget);
                const email = formData.get("email") as string;

                const { type, domain: domainExt } = isValidEmailForPublicReport(
                  email,
                  domain,
                );
                if (type === "invalid-email") {
                  setErrorMessage("Invalid email address");
                  return;
                }
                if (type === "invalid-domain") {
                  setErrorMessage(
                    `Please provide a valid email address from the domain (${domainExt}) of your organization`,
                  );
                  return;
                }

                requestReportMutation.mutate({ email });
              }}
            >
              <div className="mt-5 flex h-12 border border-[#b49fb2] bg-white md:mt-7 md:h-14 md:border-[#B676AF] lg:mt-9 lg:h-[60px]">
                <input
                  className="lg::text-xl w-full grow border-none bg-transparent px-5 font-mulish text-[10px] font-normal text-[#000000] outline-none placeholder:font-mulish placeholder:text-gray-700 focus:outline-none md:text-lg lg:font-medium"
                  type="email"
                  name="email"
                  placeholder={intl.formatMessage({ id: "modalPlaceholder" })}
                />
                <button
                  disabled={requestReportMutation.isPending}
                  type="submit"
                  className="flex w-24 flex-none flex-row items-center justify-center gap-x-1 bg-[#720072] font-mulish text-sm font-medium text-white disabled:opacity-50 md:w-32 md:gap-x-2 lg:h-[60px] lg:w-[150px] lg:text-xl"
                >
                  {requestReportMutation.isPending ? (
                    "Please wait.."
                  ) : (
                    <>
                      <CiSearch className="size-5 text-white md:size-6" />
                      <FormattedMessage id="submit" />
                    </>
                  )}
                </button>
              </div>
            </form>
            {errorMessage && (
              <p className="mt-2 text-red-500 max-md:text-sm">{errorMessage}</p>
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
