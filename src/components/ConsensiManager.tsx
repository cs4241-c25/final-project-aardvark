"use client"

import {ConsensiRecord, ConsensiSuggestion} from "@/lib/interfaces";

import axios from "axios";
import {Button} from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Card, CardHeader, CardDescription, CardContent, CardTitle, CardFooter} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { CheckCircle } from "lucide-react";
import { XCircle } from "lucide-react";
import {useEffect, useState} from "react";


interface ConsensiTableProps {
    aiSuggestions: ConsensiSuggestion[];
    userSuggestion: ConsensiSuggestion[];
}

const fetchHighestConsensusNum = async () => {
    try {
        const response = await fetch("/api/admin");
        if (!response.ok)
            throw new Error("Failed to fetch highest consensus number");
        const data = await response.json();
        const { highestConsensusNum } = data;
        return highestConsensusNum + 1;
    } catch (err) {
        console.error("Issue getting highest consensus num",err);
        return undefined;
    }
};

const ConsensiManager:  React.FC<ConsensiTableProps> = ({aiSuggestions, userSuggestion}) => {

    const [aiLists, setAILists] = useState<ConsensiSuggestion[]>(aiSuggestions);
    const [userSuggestions, setUserSuggestions] = useState<ConsensiSuggestion[]>([]);

    console.log("Data: ",userSuggestion)

    useEffect(() => {
        setAILists(aiSuggestions);
        setUserSuggestions(userSuggestion);
    }, [aiSuggestions, userSuggestion]);


    const handleApproveConsensi = async (record: ConsensiSuggestion) => {
        try {

            if(record.date == null){
                record.date = "null"
            }
            console.log(record.date);
            const newConsensusNum = await fetchHighestConsensusNum();
            if (newConsensusNum === undefined) {
                return;
            }

            const newConsensi: ConsensiRecord = {
                metadata: {
                    author: record.author,
                    date: record.date
                },
                category: record.category,
                consensusNum: newConsensusNum,
                options: record.options
            }

            await axios.post(`/api/admin`, newConsensi);

        } catch (err) {
            console.error("Error adding data:", err);
        }
    };

    const handleDeleteConsensi = async (_id: string) => {
        try {
            await axios.delete(`/api/admin/suggestions?id=${_id}`);
        } catch (err) {
            console.error("Error deleting data:", err);
        }
    };

    return (
        <Tabs defaultValue="user" className="w-[500px] self-center justify-center pt-5">
            <TabsList className=" flex ">
                <TabsTrigger value="user">User Suggestions</TabsTrigger>
                <TabsTrigger value="generate">Generate Suggestions</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
                <Card>
                    <CardHeader>
                        <CardTitle>User Suggestions</CardTitle>
                        <CardDescription>
                            Approve or Deny Consensus suggestions submitted by users.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Options</TableHead>
                                    <TableHead>Manage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userSuggestions.map((record) => (
                                    <TableRow key={record._id?.toString()}>
                                        <TableCell>{record.category}</TableCell>
                                        <TableCell>{record.author}</TableCell>
                                        <TableCell>{record.options.join(", ")}</TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button variant="primary" className="text-green-500 border-green-500 bg-transparent p-1" onClick={ async() =>
                                            {
                                                try{
                                                    await handleApproveConsensi(record)
                                                    await handleDeleteConsensi(record._id!.toString());
                                                    setUserSuggestions((prevData) =>
                                                        prevData.filter((item) => item._id !== record._id)
                                                    );
                                                }catch(error){
                                                    console.error("Error approving data:", error);
                                                }
                                            }
                                                }>
                                                <CheckCircle className="w-5 h-5" />
                                            </Button>

                                            <Button variant="primary" className="text-red-500 border-red-500 bg-transparent p-1"
                                                onClick={async() => {
                                                    try {
                                                        await handleDeleteConsensi(record._id!.toString());
                                                        setUserSuggestions((prevData) =>
                                                            prevData.filter((item) => item._id !== record._id)
                                                        );
                                                    } catch (error) {
                                                        console.error("Error deleting data:", error);
                                                        }
                                                    }
                                            }

                                            >    <XCircle className="w-5 h-5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="generate">
                <Card>
                    <CardHeader>
                        <CardTitle>Generate Suggestion</CardTitle>
                        <CardDescription>
                            Use AI to generate new Consensus Options
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Options</TableHead>
                                    <TableHead>Manage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {aiLists.map((record) => (
                                    <TableRow key={record.author + record.category + record.options}>
                                        <TableCell>{record.category}</TableCell>
                                        <TableCell>{record.author}</TableCell>
                                        <TableCell>{record.options.join(", ")}</TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button variant={undefined} className="text-green-500 border-green-500 bg-transparent p-1" onClick={ async () =>
                                            {
                                                try{
                                                    await handleApproveConsensi(record);
                                                    setAILists(aiLists => aiLists.filter(item => item !== record))
                                                } catch(error){
                                                    console.error("Error adding data:", error);
                                                    }
                                                }
                                            }>
                                                <CheckCircle className="w-5 h-5" />
                                            </Button>
                                            <Button variant={undefined} className="text-red-500 border-red-500 bg-transparent p-1"
                                                    onClick={() => setAILists(aiLists => aiLists.filter(item => item !== record))}

                                            >    <XCircle className="w-5 h-5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}


export default ConsensiManager;