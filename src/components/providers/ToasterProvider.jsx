"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#2e1a28",
          color: "#fef7ff",
          borderRadius: "9999px",
          padding: "12px 20px",
          fontWeight: 600,
          fontSize: "0.875rem",
        },
        success: {
          iconTheme: {
            primary: "#e040a0",
            secondary: "#fef7ff",
          },
        },
        error: {
          iconTheme: {
            primary: "#e040a0",
            secondary: "#fef7ff",
          },
        },
      }}
    />
  );
}
