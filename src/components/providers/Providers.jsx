"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import queryClient from "@/lib/queryClient";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </QueryClientProvider>
  );
}
