"use client";
import siteLanguagesOptions from "@/constants/site-languages-options";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/router";

const LanguageDropDown = () => {
  const router = useRouter();

  const selectedLanguage = siteLanguagesOptions.find(
    (lang) => router.locale === lang.value,
  );

  return (
    <Select.Root
      onValueChange={(value: string) => {
        router.push(router.pathname, router.asPath, {
          locale: value,
          scroll: false,
          shallow: true,
        });
      }}
      value={selectedLanguage?.value}
    >
      <Select.Trigger className="text-white outline-none ring-black ring-offset-1 focus-visible:ring-1 max-lg:w-full">
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <div className="__LanguageSwitcherTrigger flex items-center gap-x-1 max-lg:w-full max-lg:justify-between lg:gap-x-2">
          <Select.Value />
          <Select.Icon>
            <ChevronDown
              className="translate-y-0.5 max-lg:w-4"
              strokeWidth={1.5}
            />
          </Select.Icon>
        </div>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          align="center"
          sideOffset={15}
          className="z-[99999] rounded border border-black/5 bg-white shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-lg:w-[calc(100vw-64px)] max-md:w-[calc(100vw-48px)]"
        >
          <Select.Viewport>
            {siteLanguagesOptions.map((language) => (
              <Select.Item
                key={language.value}
                value={language.value}
                className="flex cursor-pointer items-center gap-5 px-[18px] py-1.5 outline-none data-[highlighted]:bg-gray-100 max-lg:justify-between"
              >
                <Select.ItemText>
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                    <p className="__lang_label capitalize max-lg:text-sm">
                      {language.value}
                    </p>
                  </div>
                </Select.ItemText>
                <Select.ItemIndicator>
                  <Check className="w-4 text-black" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default LanguageDropDown;
