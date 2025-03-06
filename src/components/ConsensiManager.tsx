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
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";


interface ConsensiTableProps {
    aiSuggestions: ConsensiSuggestion[];
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

const ConsensiManager:  React.FC<ConsensiTableProps> = ({aiSuggestions}) => {

    const form = useForm({
        defaultValues: {
            author: "",
            category: "",
            date: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
        },
    });
    const [aiLists, setAILists] = useState<ConsensiSuggestion[]>(aiSuggestions);
    const [userSuggestions, setUserSuggestions] = useState<ConsensiSuggestion[]>([]);
    const [consensusQueue, setConsensusQueue] = useState<ConsensiRecord[]>([]);

    const onSubmit = async (values: { author: string; category: string; option1: string; option2: string; option3: string; option4: string; date: string }) => {
        const suggestion:ConsensiRecord = {
            metadata: {
                author: values.author || "Anonymous",
                date: values.date || "null",
            },
            category: values.category,
            options: {
                [values.option1.trim()]: "blue",
                [values.option2.trim()]: "green",
                [values.option3.trim()]: "yellow",
                [values.option4.trim()]: "red",
            },
            consensusNum: await fetchHighestConsensusNum()
        };

        try {
            console.log("Suggestions submitted: ", suggestion);
            await axios.post("/api/admin", suggestion).then(response => {
                setConsensusQueue(prevQueue =>[...prevQueue, response.data.consensusData]);
            })
                .catch(error => {
                    console.error("Error updating consensus queue:", error);
                });
            form.reset();
        } catch (error) {
            console.error("Error submitting suggestion:", error);
        }
    };

    useEffect(() => {
        setAILists(aiSuggestions);
        axios.get("/api/admin/suggestions")
            .then(response => {
                setUserSuggestions(response.data.consensi);
            })
            .catch(error => console.error("Error fetching data:", error));

        axios.get("/api/admin/consensi").then(response => {
            setConsensusQueue(response.data.consensi);
        }).catch(error => console.error("Error fetching data:", error));
    }, [aiSuggestions]);


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
                options: {
                    [record.options[0]]: "blue",
                    [record.options[1]]: "green",
                    [record.options[2]]: "yellow",
                    [record.options[3]]: "red",
                }
            }

            await axios.post(`/api/admin`, newConsensi)
                .then(response => {
                    setConsensusQueue(prevQueue => [...prevQueue, response.data.consensusData]);
                })
                .catch(error => {
                    console.error("Error updating consensus queue:", error);
                });

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
        <Tabs defaultValue="user" className="w-[600px] self-center justify-center pt-5">
            <TabsList className=" flex ">
                <TabsTrigger value="user">User Suggestions</TabsTrigger>
                <TabsTrigger value="generate">Generate Suggestions</TabsTrigger>
                <TabsTrigger value="consensus">Create Consensus</TabsTrigger>
                <TabsTrigger value="queue">View the Queue</TabsTrigger>
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

                </Card>
            </TabsContent>
            <TabsContent value="consensus">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Consensus</CardTitle>
                        <CardDescription>
                            Create Custom Consensus
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="author"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Author</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter author name (or leave blank for Anonymous)" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="date" placeholder="Enter date" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter category" required />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="option1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Option 1</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter first option" required />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="option2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Option 2</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter second option" required />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="option3"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Option 3</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter third option" required />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="option4"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Option 4</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter fourth option" required />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full outline outline-1 outline-black">
                                    Submit Suggestion
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                </Card>
            </TabsContent>
            <TabsContent value="queue">
                <Card>
                    <CardHeader>
                        <CardTitle>View the Queue</CardTitle>
                        <CardDescription>
                            View the queue of Consensus currently staged for deployment.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Options</TableHead>
                                    <TableHead>Consensus Num</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {consensusQueue.map((record) => (
                                    <TableRow key={record.consensusNum}>
                                        <TableCell>{record.metadata.author}</TableCell>
                                        <TableCell>{record.metadata.date}</TableCell>
                                        <TableCell>{record.category}</TableCell>
                                        <TableCell>{Object.keys(record.options).join(", ")}</TableCell>
                                        <TableCell>{record.consensusNum}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>

                </Card>
            </TabsContent>
        </Tabs>
    );
}


export default ConsensiManager;