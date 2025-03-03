"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { ModalProvider } from "@/context/ModalContext";
import { ConsensiRecord, TodaysConsensus } from "@/lib/interfaces";
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
  const [result, setResult] = useState<TodaysConsensus | null>(null);
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
      // not allowed to use admin page
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

  return (
    <ModalProvider>
      {userAuthLoad ? (
        <div className="w-[100vw] h-[100vh] flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-black">
            Consensus Entry Form
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-black font-medium">Date:</label>
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
                <label className="block text-black font-medium">Author:</label>
                <input
                  type="text"
                  name="author"
                  value={record.metadata.author || ""}
                  onChange={handleMetadataChange}
                  className="border p-3 w-full rounded-lg text-black"
                />
              </div>
              <label className="block text-black font-medium">Category:</label>
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
                    onChange={(e) => handleOptionChange(index, e.target.value)}
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
            <p className="mt-4 text-red-600 text-center font-medium">{error}</p>
          )}

          {result && <p className="text-black">Consensus Added Successfully</p>}
        </div>
      )}
    </ModalProvider>
  );
};

export default ConsensusEntryForm;
