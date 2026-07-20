"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createVps,
  deleteVps,
  getAllVps,
  getVpsById,
  getVpsStats,
  restartVps,
  startVps,
  stopVps,
} from "@/features/vps/vps.thunk";

export default function TestVpsPage() {
  const dispatch = useAppDispatch();

  const { list, isLoading, error, selected } = useAppSelector(
    (state) => state.vps,
  );

  useEffect(() => {
    dispatch(
      // createVps({
      //       os: "ubuntu-24",
      //       name: "test-vps",
      //       resources: {
      //             cpu: 1,
      //             memory: 1024,
      //             storage: 10,
      //       },
      // }),
      // getAllVps(),
      // deleteVps(""),
      // getVpsById(""),
      // stopVps("6a4cfbc1ef7add6602baed2c"),
      // startVps("6a4cfbc1ef7add6602baed2c"),
      // restartVps("6a4cfbc1ef7add6602baed2c"),
      getVpsStats("6a4cfbc1ef7add6602baed2c"),
    );
  }, [dispatch]);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">VPS Test Page</h1>

      <p>
        <strong>Loading:</strong> {String(isLoading)}
      </p>

      <p>
        <strong>Error:</strong> {error ?? "None"}
      </p>

      <p>
        <strong>Total VPS:</strong> {list.length}
      </p>

      <pre className="mt-6 overflow-auto rounded-lg bg-black p-4 text-sm text-green-400">
        {JSON.stringify(list, null, 2)}
      </pre>
    </div>
  );
}
