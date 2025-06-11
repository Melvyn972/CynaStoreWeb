"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CompanyMembers({ members, isOwner, isAdmin, currentUserId, companyId, pendingInvitations }) {
  const [removingMemberId, setRemovingMemberId] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);
  const router = useRouter();

  // Can manage if user is owner or admin
  const canManageMembers = isOwner || isAdmin;

  const handleRemoveMember = async (memberId) => {
    setRemovingMemberId(memberId);
    try {
      const response = await fetch(`/api/companies/${companyId}/members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la suppression du membre");
      }

      toast.success("Membre supprimé avec succès");
      router.refresh();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error(error.message || "Erreur lors de la suppression du membre");
    } finally {
      setRemovingMemberId(null);
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    setUpdatingRoleId(memberId);
    try {
      const response = await fetch(`/api/companies/${companyId}/members/${memberId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la mise à jour du rôle");
      }

      const data = await response.json();
      toast.success(data.message);
      router.refresh();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du rôle");
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const cancelInvitation = async (invitationId) => {
    try {
      const response = await fetch(`/api/companies/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'annulation de l'invitation");
      }

      toast.success("Invitation annulée avec succès");
      router.refresh();
    } catch (error) {
      console.error("Error canceling invitation:", error);
      toast.error(error.message || "Erreur lors de l'annulation de l'invitation");
    }
  };

  return (
    <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-200 my-8">
      <div className="card-body p-6">
        <h2 className="card-title text-xl font-bold text-gray-800 dark:text-white mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Membres de l&apos;entreprise ({members.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="bg-base-200 dark:bg-gray-700">Utilisateur</th>
                <th className="bg-base-200 dark:bg-gray-700">Rôle</th>
                <th className="bg-base-200 dark:bg-gray-700">Depuis</th>
                {canManageMembers && <th className="bg-base-200 dark:bg-gray-700 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="hover">
                  <td className="flex items-center space-x-3">
                    {member.user.image ? (
                      <div className="avatar">
                        <div className="mask mask-squircle w-10 h-10">
                          <Image 
                            src={member.user.image} 
                            alt={member.user.name} 
                            width={40} 
                            height={40} 
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content mask mask-squircle w-10 h-10">
                          <span>{member.user.name?.charAt(0) || member.user.email?.charAt(0) || '?'}</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="font-bold">{member.user.name || 'Sans nom'}</div>
                      <div className="text-sm opacity-50">{member.user.email}</div>
                    </div>
                  </td>
                  <td>
                    {canManageMembers && member.role !== 'OWNER' && member.user.id !== currentUserId ? (
                      <select 
                        className={`select select-sm ${member.role === 'ADMIN' ? 'select-primary' : 'select-ghost'}`}
                        value={member.role}
                        onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                        disabled={updatingRoleId === member.id}
                      >
                        <option value="MEMBER">Membre</option>
                        <option value="ADMIN">Administrateur</option>
                      </select>
                    ) : (
                      <span className={`badge ${member.role === 'OWNER' ? 'badge-secondary' : member.role === 'ADMIN' ? 'badge-primary' : 'badge-ghost'}`}>
                        {member.role === 'OWNER' ? 'Propriétaire' : member.role === 'ADMIN' ? 'Administrateur' : 'Membre'}
                      </span>
                    )}
                    {updatingRoleId === member.id && (
                      <span className="loading loading-spinner loading-xs ml-2"></span>
                    )}
                  </td>
                  <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
                  {canManageMembers && (
                    <td className="text-right">
                      {member.user.id !== currentUserId && member.role !== 'OWNER' && (
                        <button 
                          className="btn btn-error btn-sm" 
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={removingMemberId === member.id}
                        >
                          {removingMemberId === member.id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            "Supprimer"
                          )}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending invitations section */}
        {canManageMembers && pendingInvitations.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Invitations en attente ({pendingInvitations.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="bg-base-200 dark:bg-gray-700">Email</th>
                    <th className="bg-base-200 dark:bg-gray-700">Rôle</th>
                    <th className="bg-base-200 dark:bg-gray-700">Date d&apos;envoi</th>
                    <th className="bg-base-200 dark:bg-gray-700">Expire le</th>
                    <th className="bg-base-200 dark:bg-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingInvitations.map((invitation) => (
                    <tr key={invitation.id} className="hover">
                      <td>{invitation.email}</td>
                      <td>
                        <span className={`badge ${invitation.role === 'ADMIN' ? 'badge-primary' : 'badge-ghost'}`}>
                          {invitation.role === 'ADMIN' ? 'Administrateur' : 'Membre'}
                        </span>
                      </td>
                      <td>{new Date(invitation.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(invitation.expiresAt).toLocaleDateString()}</td>
                      <td className="text-right">
                        <button 
                          className="btn btn-error btn-sm" 
                          onClick={() => cancelInvitation(invitation.id)}
                        >
                          Annuler
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 