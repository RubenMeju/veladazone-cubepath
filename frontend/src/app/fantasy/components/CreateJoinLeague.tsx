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

  const createMutation = useMutation({
    mutationFn: (name: string) =>
      api.post<{ id: number }>("/fantasy/leagues/", { name }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
      setNewLeagueName("");
      onLeagueSelected(data.id);
    },
  });

  const joinMutation = useMutation({
    mutationFn: (code: string) =>
      api.post<{ id: number }>("/fantasy/leagues/join/", { invite_code: code }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
      setInviteCode("");
      onLeagueSelected(data.id);
    },
  });

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
      <div className="flex gap-2 mb-5">
        {(["create", "join"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-[#e63946] text-white"
                : "bg-[#0f0f0f] text-gray-400 hover:text-white"
            }`}
          >
            {tab === "create" ? "➕ Crear liga" : "🔗 Unirse"}
          </button>
        ))}
      </div>

      {activeTab === "create" ? (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre de la liga..."
            value={newLeagueName}
            onChange={(e) => setNewLeagueName(e.target.value)}
            className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#e63946]"
          />
          <button
            onClick={() =>
              newLeagueName.trim() &&
              createMutation.mutate(newLeagueName.trim())
            }
            disabled={!newLeagueName.trim() || createMutation.isPending}
            className="bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {createMutation.isPending ? "Creando..." : "Crear liga"}
          </button>
        </div>
      ) : (
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
              inviteCode.trim() && joinMutation.mutate(inviteCode.trim())
            }
            disabled={inviteCode.length < 6 || joinMutation.isPending}
            className="bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {joinMutation.isPending ? "Uniéndose..." : "Unirse a liga"}
          </button>
          {joinMutation.isError && (
            <p className="text-[#e63946] text-xs text-center">
              Código no válido
            </p>
          )}
        </div>
      )}
    </div>
  );
}
