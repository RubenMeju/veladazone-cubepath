"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function CreateJoinLeague({
  onLeagueSelected,
}: {
  onLeagueSelected: (id: number) => void;
}) {
  const queryClient = useQueryClient();
  const [newLeagueName, setNewLeagueName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [isPrivate, setIsPrivate] = useState(true); // Nuevo: liga privada por defecto

  // Crear liga
  const createMutation = useMutation({
    mutationFn: (data: { name: string; is_private: boolean }) =>
      api.post<{ id: number }>("/fantasy/leagues/", data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
      setNewLeagueName("");
      onLeagueSelected(data.id);
    },
  });

  // Unirse a liga
  const joinMutation = useMutation({
    mutationFn: (data: { invite_code?: string; league_id?: number }) =>
      api.post<{ id: number }>("/fantasy/leagues/join/", data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
      setInviteCode("");
      onLeagueSelected(data.id);
    },
  });

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["create", "join"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab
                ? "bg-[#e63946] text-white"
                : "bg-[#0f0f0f] text-gray-400 hover:text-white"
            }`}
          >
            {tab === "create" ? "➕ Crear liga" : "🔗 Unirse"}
          </button>
        ))}
      </div>

      {/* Crear liga */}
      {activeTab === "create" ? (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre de la liga..."
            value={newLeagueName}
            onChange={(e) => setNewLeagueName(e.target.value)}
            className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#e63946]"
          />
          {/* Toggle privado / público */}
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="accent-[#e63946]"
            />
            Liga privada (requiere código)
          </label>
          <button
            onClick={() =>
              newLeagueName.trim() &&
              createMutation.mutate({
                name: newLeagueName.trim(),
                is_private: isPrivate,
              })
            }
            disabled={!newLeagueName.trim() || createMutation.isPending}
            className="bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            {createMutation.isPending ? "Creando..." : "Crear liga"}
          </button>
        </div>
      ) : (
        /* Unirse a liga */
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Código de invitación..."
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#e63946] font-mono tracking-widest"
            maxLength={8}
          />
          <button
            onClick={() =>
              joinMutation.mutate(
                inviteCode ? { invite_code: inviteCode.trim() } : {},
              )
            }
            disabled={
              (inviteCode.length < 6 && inviteCode !== "") ||
              joinMutation.isPending
            }
            className="bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {joinMutation.isPending ? "Uniéndose..." : "Unirse a liga"}
          </button>
          {joinMutation.isError && (
            <p className="text-[#e63946] text-xs text-center">
              Código no válido o ya eres miembro
            </p>
          )}
        </div>
      )}
    </div>
  );
}
