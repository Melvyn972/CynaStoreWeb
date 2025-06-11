import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ButtonAccount from "@/components/ButtonAccount";
import ThemeToggle from "@/app/components/ThemeToggle";
import CompanyMembers from "@/app/dashboard/companies/components/CompanyMembers";
import CompanyPurchases from "@/app/dashboard/companies/components/CompanyPurchases";
import CompanyActions from "@/app/dashboard/companies/components/CompanyActions";
import BackgroundEffects from "@/app/components/BackgroundEffects";

export const dynamic = "force-dynamic";

export default async function CompanyDetailsPage({ params }) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Get company details
  const company = await prisma.company.findUnique({
    where: { id: params.id },
  });

  if (!company) {
    notFound();
  }

  // Check if user is a member of the company
  const membership = await prisma.companyMember.findUnique({
    where: {
      companyId_userId: {
        companyId: company.id,
        userId: user.id,
      },
    },
  });

  // If not a member and not the owner, redirect to dashboard
  if (!membership && company.ownerId !== user.id) {
    redirect("/dashboard/companies");
  }

  // Determine user role and permissions
  const isOwner = company.ownerId === user.id;
  const currentRole = isOwner ? "OWNER" : membership?.role || "MEMBER";
  const isAdmin = currentRole === "ADMIN";

  // Get company purchases
  const purchases = await prisma.companyPurchase.findMany({
    where: {
      companyId: company.id,
    },
    include: {
      article: true,
    },
    orderBy: {
      purchaseDate: 'desc',
    },
    take: 10,
  });

  // Get company members
  const members = await prisma.companyMember.findMany({
    where: { companyId: company.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  // Get pending invitations
  const pendingInvitations = await prisma.companyInvitation.findMany({
    where: { 
      companyId: company.id,
      status: "PENDING"
    }
  });

  return (
    <div className="min-h-screen relative overflow-hidden p-6">
      <BackgroundEffects />
      <div className="ios-container space-y-8 relative z-20">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between ios-fade-in">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/companies"
              className="ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </Link>
            <div>
              <h1 className="ios-title text-3xl md:text-4xl mb-2">
                {company.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isOwner 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                    : currentRole === 'ADMIN'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                }`}>
                  {isOwner ? '👑 Propriétaire' : currentRole === 'ADMIN' ? '🔧 Administrateur' : '👤 Membre'}
                </span>
                <span className="ios-body">
                  {members.length} membre{members.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ButtonAccount />
          </div>
        </div>

        {/* Contenu principal en grille */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Informations de l'entreprise */}
          <div className="xl:col-span-2 dashboard-card ios-slide-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Informations de l&apos;entreprise</h2>
                <p className="ios-body">Détails et coordonnées</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Description */}
              {company.description && (
                <div className="ios-glass-light rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Description
                  </h3>
                  <p className="ios-body">{company.description}</p>
                </div>
              )}

              {/* Coordonnées */}
              <div className="ios-glass-light rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Coordonnées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.email && (
                    <div>
                      <p className="text-gray-600 dark:text-white/60 text-sm">Email</p>
                      <p className="text-gray-900 dark:text-white">{company.email}</p>
                    </div>
                  )}
                  {company.phone && (
                    <div>
                      <p className="text-gray-600 dark:text-white/60 text-sm">Téléphone</p>
                      <p className="text-gray-900 dark:text-white">{company.phone}</p>
                    </div>
                  )}
                  {company.website && (
                    <div>
                      <p className="text-gray-600 dark:text-white/60 text-sm">Site web</p>
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                        {company.website}
                      </a>
                    </div>
                  )}
                  {company.address && (
                    <div className="md:col-span-2">
                      <p className="text-gray-600 dark:text-white/60 text-sm">Adresse</p>
                      <p className="text-gray-900 dark:text-white">{company.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations légales */}
              {(company.vatNumber || company.siretNumber) && (
                <div className="ios-glass-light rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Informations légales
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {company.vatNumber && (
                      <div>
                        <p className="text-gray-600 dark:text-white/60 text-sm">Numéro TVA</p>
                        <p className="text-gray-900 dark:text-white font-mono">{company.vatNumber}</p>
                      </div>
                    )}
                    {company.siretNumber && (
                      <div>
                        <p className="text-gray-600 dark:text-white/60 text-sm">SIRET</p>
                        <p className="text-gray-900 dark:text-white font-mono">{company.siretNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions et détails */}
          <div className="ios-grid-2">
            {/* Actions */}
            <div className="ios-slide-up" style={{animationDelay: '0.1s'}}>
              <CompanyActions
                company={company}
                isOwner={isOwner}
                isAdmin={isAdmin}
                currentRole={currentRole}
                pendingInvitations={pendingInvitations}
              />
            </div>
          </div>
        </div>

        {/* Achats */}
        <div className="ios-slide-up" style={{animationDelay: '0.2s'}}>
          <CompanyPurchases purchases={purchases} />
        </div>

        {/* Membres */}
        <div className="ios-slide-up" style={{animationDelay: '0.3s'}}>
          <CompanyMembers
            members={members}
            isOwner={isOwner}
            isAdmin={isAdmin}
            currentUserId={user.id}
            companyId={company.id}
            pendingInvitations={pendingInvitations}
          />
        </div>
      </div>
    </div>
  );
}