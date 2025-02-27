"use client"

import {ConsensiRecord, ConsensiSuggestion} from "@/lib/interfaces";

import axios from "axios";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/Button";

const dummyData: ConsensiSuggestion[] = [
    {
        author: "Alice" ,
        category: "Technology",
        options: ["AI", "Blockchain", "Cybersecurity", "Your mom"],
    },
    {
        author: "Bob" ,
        category: "Health",
        options: ["Exercise", "Nutrition", "Mental Health, steroids"],
    },
    {
        author: "Charlie" ,
        category: "Education",
        options: ["Online Learning", "STEM", "Tutoring, chatgpt"],
    },
];

interface ConsensiTableProps {
    data: ConsensiSuggestion[];
}

const ConsensiManager:  React.FC<ConsensiTableProps> = ({data}) => {

    const handleApproveConsensi = async (record: ConsensiSuggestion) => {
        try {
            await axios.post(`/api/consensi`, record);
        } catch (err) {
            console.error("Error adding data:", err);
        }
    };

    const handleDeleteConsensi = async (_id: string) => {
        try {
            await axios.delete(`/api/consensi/${_id}`);
            // setData((prevData) => prevData.filter((record) => record._id !== _id));
        } catch (err) {
            console.error("Error deleting data:", err);
        }
    };

    return (
        <table className="w-full border-collapse border border-gray-300">
            <thead>
            <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-black">Category</th>
                <th className="border border-gray-300 p-2 text-black">Author</th>
                <th className="border border-gray-300 p-2 text-black">Options</th>
                <th className="border border-gray-300 p-2 text-black">Manage</th>
            </tr>
            </thead>
            <tbody>
            {data.map((record) => (
                <tr key={record._id!.toString()} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 text-black bg-white">{record.category}</td>
                    <td className="border border-gray-300 p-2 text-black bg-white">{record.author}</td>
                    <td className="border border-gray-300 p-2 text-black bg-white">{record.options}</td>
                    <td className="border border-gray-300 p-2 text-black bg-white flex-row">

                        {/*Find a way to use record id object for handle delete*/}
                        <Button onClick={() => handleApproveConsensi(record)}>Approve</Button>
                        <Button onClick={() => handleDeleteConsensi("")}>Delete</Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}


export default ConsensiManager;