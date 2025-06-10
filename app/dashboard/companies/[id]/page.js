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

  // Determine if user is owner
  const isOwner = company.ownerId === user.id;

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
      <main className="min-h-screen p-4 md:p-8 pb-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <section className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">
                {company.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {isOwner ? 'Vous êtes le propriétaire' : 'Vous êtes membre'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <ButtonAccount />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Company Information */}
            <div className="md:col-span-2 card bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-200">
              {/* [contenu inchangé] */}
            </div>

            {/* Actions - Remplacé par le composant client */}
            <CompanyActions
                company={company}
                isOwner={isOwner}
                pendingInvitations={pendingInvitations}
            />
          </div>

          {/* Purchases */}
          <CompanyPurchases purchases={purchases} />

          {/* Members */}
          <CompanyMembers
              members={members}
              isOwner={isOwner}
              currentUserId={user.id}
              companyId={company.id}
              pendingInvitations={pendingInvitations}
          />

          {/* Back to dashboard */}
          <div className="mt-8">
            <Link href="/dashboard/companies" className="btn btn-outline normal-case">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour aux entreprises
            </Link>
          </div>
        </section>
      </main>
  );
}