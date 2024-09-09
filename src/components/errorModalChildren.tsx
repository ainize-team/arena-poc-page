import React from "react";
import ReactMarkdown from "react-markdown";

interface ErrorModalChildrenProps {
  errorTitle: string;
  errorContentChildren: React.ReactNode;
  errorFooterChildren: React.ReactNode;
}

const ErrorModalChildren = ({
  errorTitle,
  errorContentChildren,
  errorFooterChildren,
}: ErrorModalChildrenProps) => {
  return (
    <div className="flex flex-col items-center justify-center self-stretch max-desktop:gap-7 min-desktop:gap-9">
      <p className="chat font-bold leading-150 text-dark max-desktop:text-sm min-desktop:text-3.5xl dark:text-light">
        &nbsp;
      </p>
      <div className="flex max-w-[500px] flex-col items-center justify-center max-desktop:gap-2 min-desktop:gap-[30px]">
        <div className="text-center text-dark max-desktop:text-xl max-desktop:leading-8 min-desktop:text-2.5xl min-desktop:leading-150 dark:text-light">
          <ReactMarkdown>{errorTitle}</ReactMarkdown>
        </div>
        {errorContentChildren}
        {errorFooterChildren}
      </div>
      <p className="chat font-bold leading-150 text-dark max-desktop:text-sm min-desktop:text-3.5xl dark:text-light">
        &nbsp;
      </p>
    </div>
  );
};

export default ErrorModalChildren;
