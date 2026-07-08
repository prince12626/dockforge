"use client";
import AppTerminal from "@/components/terminal/Terminal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";

export default function TerminalPage() {
      const { selected } = useAppSelector((state: RootState) => state.vps);
      const dispatch = useAppDispatch();
      return (
            <main className="flex h-[calc(100vh-72px)] flex-col">
                  <div className="border-b border-border px-8 py-4">
                        <h1 className="text-3xl font-semibold text-white">
                              {selected?.name}
                        </h1>

                        <p className="mt-1 text-white/60">Browser Terminal</p>
                  </div>

                  <AppTerminal />
            </main>
      );
}
