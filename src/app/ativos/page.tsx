"use client";
import { useEffect, useState } from "react";
import { useAtivosStore } from "@base/store/UseAtivoStore";
import { useConfirmation } from "@base/contexts/ConfirmationDialogContext";
import AddAtivoModalWrapper from "@base/components/ativos/AddAtivoModalWrapper";
import EditAtivoModalWrapper from "@base/components/ativos/EditAtivoModalWrapper";
import BackButton from "@base/components/ui/custom/backButton";
import type { Ativo } from "@base/types/dividends";
import { Pencil, Trash2, Wallet } from 'lucide-react';
import PrivateRoute from "@base/components/layout/PrivateRoute";

export default function AtivosPage() {
    const { ativos, loading, error, fetchAtivos, deleteAtivo } = useAtivosStore();
    const { confirm } = useConfirmation();
    const [ativoParaEditar, setAtivoParaEditar] = useState<Ativo | null>(null);

    useEffect(() => {
        fetchAtivos();
    }, [fetchAtivos]);

    const handleDeleteClick = async (ativo: Ativo) => {
        const isConfirmed = await confirm({
            title: "[ CONFIRMAR EXCLUSÃO ]",
            description: `Deseja realmente excluir o ativo ${ativo.codigo.toUpperCase()} da sua carteira? Esta ação é irreversível.`,
            confirmText: "Sim, Excluir Ativo",
        });

        if (isConfirmed) {
            await deleteAtivo(ativo.id);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-lg text-purple-400 animate-pulse">「 Carregando carteira de ativos... 」</div>;
    }
    if (error) {
        return <div className="flex h-screen items-center justify-center text-red-400">[ ERRO DE CONEXÃO: {error} ]</div>;
    }

    return (
        <PrivateRoute>
            <>
                <div className="min-h-screen text-slate-200 py-6 sm:py-10">
                    <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                        
                        <div className="mb-10">
                            <BackButton />
                        </div>

                        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-5 border-b border-purple-800/50">
                            <h1 className="text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4 sm:mb-0">
                                [ GESTÃO DE ATIVOS ]
                            </h1>
                            <AddAtivoModalWrapper />
                        </header>
                        <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-lg shadow-purple-900/20 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="border-b border-slate-700 bg-slate-800/50">
                                    <tr>
                                        <th className="p-4 text-sm font-semibold text-purple-300 tracking-wider">CÓDIGO DO ATIVO</th>
                                        <th className="p-4 text-sm font-semibold text-purple-300 tracking-wider">TIPO</th>
                                        <th className="p-4 text-sm font-semibold text-purple-300 tracking-wider text-right">AÇÕES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ativos.map(ativo => (
                                        <tr key={ativo.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/70 transition-colors">
                                            <td className="p-4 font-medium text-blue-300">{ativo.codigo}</td>
                                            <td className="p-4 text-slate-400">{ativo.tipo}</td>
                                            <td className="p-4">
                                                <div className="flex justify-end items-center gap-3">
                                                    <button onClick={() => setAtivoParaEditar(ativo)} className="p-2 rounded-full hover:bg-slate-700 group" aria-label="Editar Ativo">
                                                        <Pencil className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(ativo)} className="p-2 rounded-full hover:bg-slate-700 group" aria-label="Excluir Ativo">
                                                        <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {ativos.length === 0 && (
                                <div className="text-center text-slate-500 p-8 flex flex-col items-center gap-4">
                                    <Wallet className="w-16 h-16 text-slate-700" />
                                    <p>Nenhum ativo cadastrado. Clique no botão de adicionar para começar.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <EditAtivoModalWrapper
                    ativoToEdit={ativoParaEditar}
                    onClose={() => setAtivoParaEditar(null)}
                />
            </>
        </PrivateRoute>
    );
}

