"use client";

import { useState } from "react";
import Image from "next/image";

import Button from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createVps } from "@/features/vps/vps.thunk";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const osOptions = [
  {
    id: "ubuntu-24",
    name: "Ubuntu 24.04",
    logo: "https://brandslogos.com/wp-content/uploads/images/large/ubuntu-logo.png",
  },
  {
    id: "ubuntu-22",
    name: "Ubuntu 22.04",
    logo: "https://brandslogos.com/wp-content/uploads/images/large/ubuntu-logo.png",
  },
  {
    id: "ubuntu-20",
    name: "Ubuntu 20.04",
    logo: "https://brandslogos.com/wp-content/uploads/images/large/ubuntu-logo.png",
  },
  {
    id: "debian-12",
    name: "Debian 12",
    logo: "https://logodix.com/logo/1171807.png",
  },
  {
    id: "debian-11",
    name: "Debian 11",
    logo: "https://logodix.com/logo/1171807.png",
  },
  {
    id: "alpine-3.21",
    name: "Alpine 3.21",
    logo: "https://i.ibb.co/rRhpX9Xn/285a4588-4e0b-40dd-be11-d68ea5e1eb24.png",
  },
  {
    id: "alpine-3.19",
    name: "Alpine 3.19",
    logo: "https://i.ibb.co/rRhpX9Xn/285a4588-4e0b-40dd-be11-d68ea5e1eb24.png",
  },
];

const CreateVPSPage = () => {
  const dispatch = useAppDispatch();

  const { isCreating, error } = useAppSelector((state) => state.vps);

  const [formData, setFormData] = useState({
    name: "",
    os: "ubuntu-24",
    resources: {
      cpu: 1,
      memory: 1024,
      storage: 10,
    },
  });
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading("Deploying your VPS...");

    try {
      const response = await dispatch(createVps(formData)).unwrap();
      console.log(response);
      toast.success("VPS deployed successfully 🎉", {
        id: loadingToast,
      });

      router.push(`/dashboard/vps/${response.data._id}`);
    } catch (err) {
      console.log("UNWRAP:", err, typeof err);
      toast.error(String(err), {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="w-full h-full p-8 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">Deploy New VPS</h2>

          <p className="text-white/50 mt-2 text-lg">
            Configure your resources and select your preferred OS image.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 border border-white/10 p-6">
              <label className="block text-sm font-medium text-white/70 mb-3">
                Instance Name
              </label>

              <input
                type="text"
                value={formData.name}
                className="w-full bg-black border border-white/10 p-4 text-white focus:border-white outline-none transition"
                placeholder="e.g., production-server-01"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="bg-white/5 border border-white/10 p-6">
              <label className="block text-sm font-medium text-white/70 mb-4">
                Select Operating System
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {osOptions.map((os) => (
                  <button
                    key={os.id}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        os: os.id,
                      })
                    }
                    className={`p-6 border transition-all flex flex-col items-center gap-4 ${
                      formData.os === os.id
                        ? "border-white bg-white/10"
                        : "border-white/10 bg-black hover:border-white/30"
                    }`}
                  >
                    <Image
                      src={os.logo}
                      alt={os.name}
                      width={50}
                      height={50}
                      className="w-12 h-12 object-contain"
                    />

                    <span className="text-sm font-medium">{os.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white/5 border border-white/10 p-8 space-y-6">
              <h3 className="text-xl font-semibold border-b border-white/10 pb-4">
                Resources
              </h3>

              <div className="space-y-4">
                {[
                  {
                    label: "CPU Cores",
                    key: "cpu",
                    unit: "Cores",
                  },
                  {
                    label: "Memory",
                    key: "memory",
                    unit: "MB",
                  },
                  {
                    label: "Storage",
                    key: "storage",
                    unit: "GB",
                  },
                ].map((item) => (
                  <div key={item.key}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">{item.label}</span>

                      <span className="font-mono">
                        {
                          formData.resources[
                            item.key as keyof typeof formData.resources
                          ]
                        }{" "}
                        {item.unit}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={
                        item.key === "cpu"
                          ? 1
                          : item.key === "storage"
                            ? 10
                            : 1024
                      }
                      max={
                        item.key === "cpu"
                          ? 16
                          : item.key === "storage"
                            ? 50
                            : 8192
                      }
                      className="w-full accent-white"
                      value={
                        formData.resources[
                          item.key as keyof typeof formData.resources
                        ]
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          resources: {
                            ...formData.resources,
                            [item.key]: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button disabled={isCreating} className="w-full py-3 text-lg">
                {isCreating ? "Deploying..." : "Deploy Instance"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVPSPage;
