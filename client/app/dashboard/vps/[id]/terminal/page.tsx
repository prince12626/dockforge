"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getVpsById } from "@/features/vps/vps.thunk";

const TerminalComponent = dynamic(
      () => import("@/components/terminal/Terminal"),
      {
            ssr: false,
      },
);

export default function TerminalPage() {
      const params = useParams();
      const id = params.id as string;
      const dispatch = useAppDispatch();
      const { selected, isLoading } = useAppSelector((state) => state.vps);

      useEffect(() => {
            if (!id) return;

            if (selected?._id !== id) {
                  dispatch(getVpsById(id));
            }
      }, [id]);

      if (isLoading || !selected) {
            return (
                  <div className="flex h-[calc(100vh-72px)] items-center justify-center text-white">
                        Loading VPS...
                  </div>
            );
      }

      return (
            <main className="flex h-[calc(100vh-72px)] min-h-0 flex-col">
                  <div className="border-b border-border px-8 py-4">
                        <h1 className="text-3xl font-semibold text-white">
                              {selected.name}
                        </h1>
                        <p className="mt-1 text-white/60">Browser Terminal</p>
                  </div>
                  <div className="flex-1 p-6">
                        <TerminalComponent vpsId={selected.container.id} />
                  </div>
            </main>
      );
}
