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
    userSuggestions: ConsensiSuggestion[];
}

const ConsensiManager:  React.FC<ConsensiTableProps> = ({aiSuggestions, userSuggestions }) => {

    const [aiLists, setAILists] = useState<ConsensiSuggestion[]>(aiSuggestions);

    useEffect(() => {
        setAILists(aiSuggestions);
    }, [aiSuggestions]);


    const handleApproveConsensi = async (record: ConsensiSuggestion) => {
        try {
            await axios.post(`/api/admin`, record);
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
                                            <Button variant="primary" className="text-green-500 border-green-500" onClick={() => handleApproveConsensi(record)}>
                                                <CheckCircle className="w-5 h-5" />
                                            </Button>
                                            {/*figure out how to delete probably*/}
                                            <Button variant="primary" className="text-red-500 border-red-500"
                                                // onClick={() => setData((prevData) => prevData
                                                //     .filter((item) => item !== record))}

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
                                            <Button variant={undefined} className="text-green-500 border-green-500 bg-transparent p-1" onClick={() => handleApproveConsensi(record)}>
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