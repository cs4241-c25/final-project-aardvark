"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { ModalProvider } from "@/context/ModalContext";
import { ConsensiRecord } from "@/lib/interfaces";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ConsensusEntryForm = () => {
  const [record, setRecord] = useState<ConsensiRecord>({
    metadata: {
      date: "",
      author: null,
    },
    category: "",
    consensusNum: 0,
    options: ["", "", "", ""],
  });

  const [result, setResult] = useState<ConsensiRecord | null>(null);
  const [allConsensi, setAllConsensi] = useState<ConsensiRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [userAuthLoad, setUserAuthLoad] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (
      !session ||
      session.user?.image === "anonymous" ||
      (session.user?.email !== process.env.NEXT_PUBLIC_ARI_ADMIN &&
        session.user?.email !== process.env.NEXT_PUBLIC_JACK_ADMIN &&
        session.user?.email !== process.env.NEXT_PUBLIC_GUS_ADMIN &&
        session.user?.email !== process.env.NEXT_PUBLIC_WALDEN_ADMIN &&
        session.user?.email !== process.env.NEXT_PUBLIC_STEVE_ADMIN &&
        session.user?.email !== process.env.NEXT_PUBLIC_BMO_ADMIN)
    ) {
      router.replace("/");
    } else {
      setUserAuthLoad(false);
    }
  }, [session]);

  useEffect(() => {
    const fetchHighestConsensusNum = async () => {
      try {
        const response = await fetch("/api/admin");
        if (!response.ok)
          throw new Error("Failed to fetch highest consensus number");
        const data = await response.json();
        const { highestConsensusNum } = data;
        setRecord((prev) => ({
          ...prev,
          consensusNum: highestConsensusNum + 1,
        }));
      } catch (err) {
        setError("Failed to retrieve the latest consensus number.");
      }
    };

    fetchHighestConsensusNum();
  }, [userAuthLoad]);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRecord((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [name]: value,
      },
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...record.options];
    updatedOptions[index] = value;
    setRecord((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setRecord((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const { date } = record.metadata;
    if (!date || record.options.some((opt) => opt.trim() === "")) {
      setError("Please fill in all metadata fields and all 4 options.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "An error occurred.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResult(data.consensusData);
    } catch (err) {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAllConsensi = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/consensi", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const err = await response.json();
          setError(err.error || "An error occurred.");
          return;
        }

        const data = await response.json();
        console.log("data:", data.consensi);
        setAllConsensi(data.consensi);
      } catch (err) {
        setError("An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    getAllConsensi().catch((err) => console.error(err));
  }, []);

  return (
    <ModalProvider>
      <div className="w-screen h-screen flex justify-center items-center">
        {userAuthLoad ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-row gap-8">
            {/* Consensus Entry Form */}
            <div className="w-[50vw] p-6 bg-white shadow-lg rounded-lg">
              <h2 className="text-2xl font-bold mb-6 text-black">
                Consensus Entry Form
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-black font-medium">
                      Date:
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={record.metadata.date}
                      onChange={handleMetadataChange}
                      className="border p-3 w-full rounded-lg text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium">
                      Author:
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={record.metadata.author || ""}
                      onChange={handleMetadataChange}
                      className="border p-3 w-full rounded-lg text-black"
                    />
                  </div>
                  <label className="block text-black font-medium">
                    Category:
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={record.category}
                    onChange={handleCategoryChange}
                    className="border p-3 w-full rounded-lg text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Options (exactly 4):
                  </label>
                  {record.options.map((option, index) => (
                    <div key={index} className="mb-3">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        className="border p-3 w-full rounded-lg text-black"
                        required
                      />
                    </div>
                  ))}
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </form>

              {error && (
                <p className="mt-4 text-red-600 text-center font-medium">
                  {error}
                </p>
              )}

              {result && (
                <p className="text-black">Consensus Added Successfully</p>
              )}
            </div>

            {/* Display all consensi */}
            <div className="w-[50vw] p-6 bg-white shadow-lg rounded-lg overflow-y-auto h-[70vh]">
              <h3 className="text-xl font-bold mb-4 text-black">
                All Consensi
              </h3>
              {loading ? (
                <LoadingSpinner />
              ) : allConsensi && allConsensi.length > 0 ? (
                allConsensi.map((consensus, index) => (
                  <div key={index} className="border p-4 mb-4">
                    <p className="text-black">
                      <strong>Date:</strong> {consensus.metadata.date}
                    </p>
                    <p className="text-black">
                      <strong>Author:</strong> {consensus.metadata.author}
                    </p>
                    <p className="text-black">
                      <strong>Category:</strong> {consensus.category}
                    </p>
                    <p className="text-black">
                      <strong>Consensus Number:</strong> {consensus.consensusNum}
                    </p>
                    <p className="text-black">
                      <strong>Options:</strong> {consensus.options.join(", ")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-black">No consensi found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </ModalProvider>
  );
};

export default ConsensusEntryForm;
