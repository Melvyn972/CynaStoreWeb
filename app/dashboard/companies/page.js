import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import Link from "next/link";
import BackgroundEffects from "@/app/components/BackgroundEffects";
import InvitationActions from "@/components/InvitationActions";

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
    <div className="min-h-screen relative overflow-hidden p-6">
      <BackgroundEffects />
      <div className="ios-container space-y-8 relative z-20">
        {/* Header */}
        <div className="text-center space-y-4 ios-fade-in mb-12">
          <h1 className="ios-title text-4xl md:text-5xl">
            Mes Entreprises
          </h1>
          <p className="ios-body text-lg max-w-2xl mx-auto">
            Gérez vos entreprises et leurs membres depuis ce tableau de bord centralisé.
          </p>
        </div>

        {/* Actions rapides */}
        <div className="flex justify-center mb-8 ios-slide-up">
          <Link
            href="/dashboard/companies/new"
            className="ios-button-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouvelle Entreprise
          </Link>
        </div>

        {/* Invitations en attente */}
        {pendingInvitations.length > 0 && (
          <div className="dashboard-card ios-slide-up mb-8" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                Invitations en attente
              </h2>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full border border-orange-500/30">
                {pendingInvitations.length} en attente
              </span>
            </div>
            
            <div className="ios-grid-2">
              {pendingInvitations.map((invitation) => (
                <InvitationActions key={invitation.id} invitation={invitation} />
              ))}
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="ios-grid-3 ios-slide-up mb-8" style={{animationDelay: '0.2s'}}>
          {/* Total entreprises */}
          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{companies.length}</div>
            <div className="dashboard-stat-label">Total Entreprises</div>
          </div>

          {/* Entreprises créées */}
          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{ownedCompanies.length}</div>
            <div className="dashboard-stat-label">Créées</div>
          </div>

          {/* Invitations */}
          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{pendingInvitations.length}</div>
            <div className="dashboard-stat-label">Invitations</div>
          </div>
        </div>

        {/* Liste des entreprises */}
        <div className="dashboard-card ios-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              Mes Entreprises ({companies.length})
            </h2>
            <Link href="/dashboard/companies/new" className="ios-button-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvelle Entreprise
            </Link>
          </div>
          
          {companies.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="ios-body mb-6">Vous n&apos;avez pas encore d&apos;entreprise.</p>
              <Link
                href="/dashboard/companies/new"
                className="ios-button-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Créer ma première entreprise
              </Link>
            </div>
          ) : (
            <div className="ios-grid-3">
              {companies.map((company) => (
                <div key={company.id} className="ios-glass-light rounded-2xl p-6 hover:bg-white/20 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                        {company.name}
                      </h3>
                      <p className="ios-body text-sm line-clamp-2 mb-4">
                        {company.description || "Aucune description"}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ml-3 ${
                      company.isOwner 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {company.isOwner ? 'Propriétaire' : 'Membre'}
                    </span>
                  </div>
                  
                  <div className="mt-6">
                    <Link 
                      href={`/dashboard/companies/${company.id}`}
                      className="ios-button-primary w-full"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                      </svg>
                      Gérer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Retour au tableau de bord */}
        <div className="text-center ios-slide-up" style={{animationDelay: '0.4s'}}>
          <Link href="/dashboard" className="ios-button-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
} 