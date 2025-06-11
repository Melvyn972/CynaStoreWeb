import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

// Ce layout assure que seuls les utilisateurs avec le rôle admin peuvent accéder au tableau de bord d'administration
export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/auth/login");
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Si l'utilisateur n'est pas un admin, rediriger vers le tableau de bord
  if (user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <>
      {children}
    </>
  );
} 