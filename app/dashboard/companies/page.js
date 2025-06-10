import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import Link from "next/link";
import ButtonAccount from "@/components/ButtonAccount";
import ThemeToggle from "@/app/components/ThemeToggle";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Get companies owned by the user
  const ownedCompanies = await prisma.company.findMany({
    where: { ownerId: user.id },
  });

  // Get companies where user is a member
  const memberCompanies = await prisma.companyMember.findMany({
    where: { userId: user.id },
    include: { company: true },
  });

  // Combine and format companies
  const companies = [
    ...ownedCompanies.map(company => ({
      ...company,
      isOwner: true,
      role: "OWNER",
    })),
    ...memberCompanies
      .filter(membership => !ownedCompanies.some(owned => owned.id === membership.companyId))
      .map(membership => ({
        ...membership.company,
        isOwner: false,
        role: membership.role,
      })),
  ];

  // Get pending invitations
  const pendingInvitations = await prisma.companyInvitation.findMany({
    where: { 
      userId: user.id,
      status: "PENDING"
    },
    include: {
      company: true
    }
  });

  return (
    <main className="min-h-screen p-4 md:p-8 pb-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <section className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">Mes Entreprises</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ButtonAccount />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos entreprises et leurs membres
          </p>
          <Link
            href="/dashboard/companies/new"
            className="btn btn-primary text-white normal-case"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouvelle Entreprise
          </Link>
        </div>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Invitations en attente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="card bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl">
                  <div className="card-body p-6">
                    <h3 className="card-title text-lg font-bold text-gray-800 dark:text-white mb-2">
                      {invitation.company.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Vous avez été invité à rejoindre cette entreprise.
                    </p>
                    <div className="flex space-x-2">
                      <Link 
                        href={`/dashboard/companies/invitations/${invitation.token}`}
                        className="btn btn-primary text-white normal-case flex-1"
                      >
                        Voir l'invitation
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Companies list */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Mes Entreprises ({companies.length})
          </h2>
          {companies.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">Vous n'avez pas encore d'entreprise.</p>
              <Link
                href="/dashboard/companies/new"
                className="btn btn-primary text-white normal-case mt-4"
              >
                Créer ma première entreprise
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company) => (
                <div key={company.id} className="card bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl">
                  <div className="card-body p-6">
                    <div className="flex justify-between">
                      <h3 className="card-title text-lg font-bold text-gray-800 dark:text-white mb-2">
                        {company.name}
                      </h3>
                      <span className={`badge ${company.isOwner ? 'badge-secondary' : 'badge-primary'}`}>
                        {company.isOwner ? 'Propriétaire' : 'Membre'}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {company.description || "Aucune description"}
                    </p>
                    
                    <div className="mt-4">
                      <Link 
                        href={`/dashboard/companies/${company.id}`}
                        className="btn btn-primary text-white normal-case w-full"
                      >
                        Gérer
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Back to dashboard */}
        <div className="mt-8">
          <Link href="/dashboard" className="btn btn-outline normal-case">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au tableau de bord
          </Link>
        </div>
      </section>
    </main>
  );
} 