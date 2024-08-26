import {
  useFloating,
  shift,
  offset,
  autoUpdate,
  flip,
  useInteractions,
  useDismiss,
  useClick,
} from "@floating-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { cn } from "../utils/cn";

const MenuPopUp = () => {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: open,
    onOpenChange: setOpen,
    strategy: "fixed",
    placement: "bottom-start",
    middleware: [shift(), flip(), offset(10)],
    whileElementsMounted: autoUpdate,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context, {
      ancestorScroll: true,
    }),
  ]);

  return (
    <>
      {/* 버튼 */}
      <button
        type="button"
        ref={refs.setReference}
        {...getReferenceProps()}
        className={cn("flex items-center")}
      >
        <span>test</span>
      </button>

      {/* 위 버튼 클릭시 팝오버 */}
      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps({
            onClick: () => setOpen(false),
          })}
          className="bg-white shadow-popover z-popover w-56 overflow-hidden rounded-2xl p-2"
        >
          <div key={123}>asdf</div>
          <div key={124}>123</div>
          <div key={125}>asdfsadf</div>
          <div key={126}>zxvxc</div>
        </div>
      )}
    </>
  );
};

export default MenuPopUp;
