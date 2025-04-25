"use client";

import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import config from "@/config";
import { ThemeProvider } from "@/app/context/ThemeContext";

const ClientLayout = ({ children }) => {
  return (
    <>
      <SessionProvider>
        <ThemeProvider>
          <NextTopLoader color={config.colors.main} showSpinner={false} />

          {children}

          <Toaster
            toastOptions={{
              duration: 3000,
            }}
          />

          <Tooltip
            id="tooltip"
            className="z-[60] !opacity-100 max-w-sm shadow-lg"
          />
        </ThemeProvider>
      </SessionProvider>
    </>
  );
};

export default ClientLayout;
