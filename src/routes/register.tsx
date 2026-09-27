import { createFileRoute } from "@tanstack/react-router";
import { AccountForm } from "@/components/account-form";

export const Route = createFileRoute("/register")({ component: () => <AccountForm register /> });
