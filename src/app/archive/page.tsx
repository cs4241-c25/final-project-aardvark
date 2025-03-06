"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { House } from "@phosphor-icons/react";
import { IconButton } from "@/components/ui/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import axios from "axios";

type Consensus = {
    consensusNum: number;
    date: string;
    category: string;
    options: Record<string, string>;
    submission: Record<string, number>;
    overall: Array<{ option: string; points: number }>;
    numSubmissions: number;
};

const getISODateString = (date: Date) => date.toISOString().split("T")[0];

export default function ArchivePage() {
    const router = useRouter();
    const [consensi, setConsensi] = useState<Consensus[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchDate, setSearchDate] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);

    const filteredConsensi = useMemo(() => {
        return consensi.filter((consensus) => {
            const matchesDate = searchDate
                ? getISODateString(new Date(consensus.date)) === searchDate
                : true;

            const matchesCategory = searchCategory
                ? consensus.category.toLowerCase().includes(searchCategory.toLowerCase())
                : true;

            return matchesDate && matchesCategory;
        });
    }, [consensi, searchDate, searchCategory]);

    const fetchConsensi = useCallback(async () => {
        try {
            const { data } = await axios.get<Consensus[]>("/api/consensi");
            const sortedData = data.sort((a, b) => a.consensusNum - b.consensusNum);
            setConsensi(sortedData);
        } catch (err) {
            let errorMessage = "Failed to fetch archive data";
            if (axios.isAxiosError(err)) {
                errorMessage = err.response ? "Failed to fetch archive data" : err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConsensi();
    }, [fetchConsensi]);

    const toggleExpand = useCallback((id: string) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <main className="max-w-4xl mx-auto p-4">
            <header className="flex justify-center items-center px-2 md:px-4 border-b border-inset py-2">
                <IconButton
                    title="Play"
                    icon={<House size={24} />}
                    onClick={() => router.push("/play")}
                />
            </header>

            <h1 className="text-3xl font-bold mb-4">Consensus Archive</h1>

            <div className="flex gap-4 mb-4">
                <FilterInput
                    label="Search by Date:"
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                />
                <FilterInput
                    label="Search by Category:"
                    type="text"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    placeholder="Enter category"
                />
            </div>

            {filteredConsensi.length > 0 ? (
                filteredConsensi.map((consensus) => (
                    <ConsensusItem
                        key={consensus.consensusNum.toString()}
                        consensus={consensus}
                        expanded={expanded}
                        toggleExpand={toggleExpand}
                    />
                ))
            ) : (
                <p className="text-gray-500 text-center">No results found for the selected filters.</p>
            )}
        </main>
    );
}

const FilterInput: React.FC<{
    label: string;
    type: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
}> = ({ label, type, value, onChange, placeholder }) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-white">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-1 p-2 border border-black text-black bg-white rounded w-full"
        />
    </div>
);

const ConsensusItem: React.FC<{
    consensus: Consensus;
    expanded: Record<string, boolean>;
    toggleExpand: (id: string) => void;
}> = ({ consensus, expanded, toggleExpand }) => {
    const id = consensus.consensusNum.toString();
    const isExpanded = expanded[id];
    const hasUserSubmission = Object.keys(consensus.submission).length > 0;
    const hasGlobalSubmissions = consensus.numSubmissions > 0;

    return (
        <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition mb-4">
            <button
                onClick={() => toggleExpand(id)}
                className="text-lg font-semibold w-full text-left"
                aria-expanded={isExpanded}
            >
                #{consensus.consensusNum} - {consensus.category}
            </button>
            <p className="text-gray-500 text-sm">
                {new Date(consensus.date).toLocaleDateString()}
            </p>

            {isExpanded && (
                <div className="flex flex-col gap-2 mt-4">
                    {!hasGlobalSubmissions ? (
                        <div className="p-4 text-center text-gray-500">
                            No submissions have been made for this consensus.
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            {/* Only show user's ranking if they submitted */}
                            {hasUserSubmission && (
                                <RankingColumn
                                    title="YOUR RANKING"
                                    entries={Object.entries(consensus.submission)}
                                    options={consensus.options}
                                />
                            )}

                            {/* Overall ranking only shown if there are global submissions */}
                            <div className={`flex-1 ${!hasUserSubmission ? 'w-full' : ''}`}>
                                <h3 className="font-semibold mb-2 text-center">OVERALL RANKING</h3>
                                {consensus.overall.map(({ option }) => (
                                    <AnimatedOption
                                        key={option}
                                        option={option}
                                        colorClass={`bg-game${consensus.options[option].charAt(0).toUpperCase() + consensus.options[option].slice(1)}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <p className="text-sm text-gray-500 text-center">
                        Total submissions: {consensus.numSubmissions}
                    </p>
                </div>
            )}
        </div>
    );
};

const RankingColumn: React.FC<{
    title: string;
    entries: [string, unknown][];
    options: Record<string, string>;
    sortDirection?: "asc" | "desc";
}> = ({ title, entries, options, sortDirection = "asc" }) => {
    const sortedEntries = useMemo(() => {
        return entries
            .map(([option, rank]) => ({
                option,
                score: Number(rank),
                color: options[option],
            }))
            .sort((a, b) =>
                sortDirection === "desc"
                    ? b.score - a.score || a.option.localeCompare(b.option)
                    : a.score - b.score
            );
    }, [entries, options, sortDirection]);

    return (
        <div className="flex-1">
            <h3 className="font-semibold mb-2 text-center">{title}</h3>
            {sortedEntries.length > 0 ? (
                sortedEntries.map(({ option, color }) => (
                    <AnimatedOption
                        key={option}
                        option={option}
                        colorClass={`bg-game${color.charAt(0).toUpperCase() + color.slice(1)}`}
                    />
                ))
            ) : (
                <div className="p-4 text-center text-gray-500">No results available</div>
            )}
        </div>
    );
};

const AnimatedOption: React.FC<{
    option: string;
    colorClass: string;
}> = ({ option, colorClass }) => (
    <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className={clsx(
            "p-4 rounded-lg text-center text-black font-bold uppercase mb-2",
            colorClass
        )}
    >
        {option}
    </motion.div>
);