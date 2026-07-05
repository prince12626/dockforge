"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";

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
            id: "debian-12",
            name: "Debian 12",
            logo: "https://logodix.com/logo/1171807.png",
      },
      {
            id: "alpine",
            name: "Alpine 3.22",
            logo: "https://i.ibb.co/rRhpX9Xn/285a4588-4e0b-40dd-be11-d68ea5e1eb24.png",
      },
];

const CreateVPSPage = () => {
      const [formData, setFormData] = useState({
            name: "",
            os: "ubuntu-24" as string,
            cpu: 1,
            memory: 1024,
            storage: 10,
      });

      return (
            // Removed max-w-3xl for full width
            <div className="w-full h-full p-8 md:p-12">
                  <div className="max-w-6xl mx-auto space-y-10">
                        {/* Header Section */}
                        <div>
                              <h2 className="text-4xl font-bold tracking-tight">
                                    Deploy New VPS
                              </h2>
                              <p className="text-white/50 mt-2 text-lg">
                                    Configure your resources and select your
                                    preferred OS image.
                              </p>
                        </div>

                        <form className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                              {/* Left Column: Configuration */}
                              <div className="lg:col-span-2 space-y-8">
                                    {/* Instance Name */}
                                    <div className="bg-white/5 border border-white/10 p-6">
                                          <label className="block text-sm font-medium text-white/70 mb-3">
                                                Instance Name
                                          </label>
                                          <input
                                                type="text"
                                                className="w-full bg-black border border-white/10 p-4 text-white focus:border-white outline-none transition"
                                                placeholder="e.g., production-server-01"
                                                onChange={(e) =>
                                                      setFormData({
                                                            ...formData,
                                                            name: e.target
                                                                  .value,
                                                      })
                                                }
                                          />
                                    </div>

                                    {/* OS Selection */}
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
                                                                        os: os.id as string,
                                                                  })
                                                            }
                                                            className={`p-6 border transition-all flex flex-col items-center gap-4 ${
                                                                  formData.os ===
                                                                  os.id
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
                                                            <span className="text-sm font-medium">
                                                                  {os.name}
                                                            </span>
                                                      </button>
                                                ))}
                                          </div>
                                    </div>
                              </div>

                              {/* Right Column: Resource Summary (Sticky) */}
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
                                                                  <span className="text-white/60">
                                                                        {
                                                                              item.label
                                                                        }
                                                                  </span>
                                                                  <span className="font-mono">
                                                                        {
                                                                              formData[
                                                                                    item.key as keyof typeof formData
                                                                              ]
                                                                        }{" "}
                                                                        {
                                                                              item.unit
                                                                        }
                                                                  </span>
                                                            </div>
                                                            <input
                                                                  type="range"
                                                                  min={
                                                                        item.key ===
                                                                        "cpu"
                                                                              ? 1
                                                                              : 1024
                                                                  }
                                                                  max={
                                                                        item.key ===
                                                                        "cpu"
                                                                              ? 16
                                                                              : 8192
                                                                  }
                                                                  className="w-full accent-white"
                                                                  onChange={(
                                                                        e,
                                                                  ) =>
                                                                        setFormData(
                                                                              {
                                                                                    ...formData,
                                                                                    [item.key]:
                                                                                          Number(
                                                                                                e
                                                                                                      .target
                                                                                                      .value,
                                                                                          ),
                                                                              },
                                                                        )
                                                                  }
                                                            />
                                                      </div>
                                                ))}
                                          </div>

                                          <div className="pt-6 border-t border-white/10">
                                                <Button className="w-full py-3 text-lg">
                                                      Deploy Instance
                                                </Button>
                                          </div>
                                    </div>
                              </div>
                        </form>
                  </div>
            </div>
      );
};

export default CreateVPSPage;
