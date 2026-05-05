import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/giris")({ component: AdminLogin });

function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/admin", replace: true });
  }, [navigate]);

  return null;
}
