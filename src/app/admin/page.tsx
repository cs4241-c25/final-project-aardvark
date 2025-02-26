"use client";
import { useState } from "react";
import { ConsensiRecord } from "@/lib/interfaces";

interface ConsensusResult {
  numSubmissions: number;
  consensus: Record<string, number>;
}

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
  const [result, setResult] = useState<ConsensusResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "consensusNum") {
      setRecord((prev) => ({
        ...prev,
        consensusNum: parseInt(value, 10) || 0,
      }));
    } else if (name === "category") {
      setRecord((prev) => ({
        ...prev,
        category: value,
      }));
    } else {
      // Handles "date" and "author" fields under metadata
      setRecord((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [name]: value,
        },
      }));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...record.options];
    updatedOptions[index] = value;
    setRecord((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const { date, author } = record.metadata;
    if (
      !date ||
      !author ||
      record.options.some((opt) => opt.trim() === "")
    ) {
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
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Consensus Entry Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Date:</label>
            <input
              type="date"
              name="date"
              value={record.metadata.date}
              onChange={handleMetadataChange}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Author:</label>
            <input
              type="text"
              name="author"
              value={record.metadata.author || ""}
              onChange={handleMetadataChange}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Category:</label>
            <input
              type="text"
              name="category"
              value={record.category}
              onChange={handleMetadataChange}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Consensus Number:</label>
            <input
              type="number"
              name="consensusNum"
              value={record.consensusNum || ""}
              onChange={handleMetadataChange}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Options (exactly 4):</label>
          {record.options.map((option, index) => (
            <div key={index} className="mb-3">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600 text-center font-medium">{error}</p>}
      
      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold text-gray-800">Consensus Results:</h3>
          <pre className="mt-2 p-3 bg-white rounded-lg shadow-sm overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ConsensusEntryForm;
