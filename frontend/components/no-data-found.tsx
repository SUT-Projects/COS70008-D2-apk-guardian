import clsx from "clsx";

import { NoDataIcon } from "./icons/no-data-icon";

import { fontMono } from "@/config/fonts";

type NoDataFoundProps = {
  title?: string;
  message?: string;
  className?: string;
};

export default function NoDataFound({
  title = "No Data Found",
  message = "",
  className = "",
}: NoDataFoundProps) {
  return (
    <div
      className={clsx(
        "size-full flex flex-col justify-center items-center p-10 border border-slate-200 rounded-lg",
        className,
      )}
    >
      <NoDataIcon className="mb-4" size={128} />
      <h2
        className={clsx(
          fontMono.className,
          "text-2xl font-medium mb-1 text-center",
        )}
      >
        {title}
      </h2>
      {message.length !== 0 && (
        <p
          className={clsx(
            fontMono.className,
            "text-slate-600 text-medium text-center text-wrap w-2/3",
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}
