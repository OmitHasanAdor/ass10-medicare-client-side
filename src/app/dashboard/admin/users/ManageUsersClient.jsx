"use client";

import { useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Chip,
    Button,
    Tooltip,
    Input
} from "@heroui/react";
import { 
    MagnifyingGlassIcon, 
    TrashIcon, 
    NoSymbolIcon 
} from "@heroicons/react/24/outline";

export default function ManageUsersClient({ initialUsers }) {
    const [users, setUsers] = useState(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");

    // ইউজার সাসপেন্ড হ্যান্ডলার
    const handleSuspendUser = async (userId) => {
        if (!confirm("Are you sure you want to suspend this user?")) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/suspend`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                setUsers((prev) =>
                    prev.map((u) => (u._id?.$oid || u._id) === userId ? { ...u, status: "suspended" } : u)
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    // ইউজার ডিলিট হ্যান্ডলার
    const handleDeleteUser = async (userId) => {
        if (!confirm("Permanently delete this user?")) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setUsers((prev) => prev.filter((u) => (u._id?.$oid || u._id) !== userId));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* সার্চ বার */}
            <div className="flex justify-end">
                <Input
                    isClearable
                    className="w-full sm:max-w-xs"
                    placeholder="Search accounts name/email..."
                    startContent={<MagnifyingGlassIcon className="w-4 h-4 text-zinc-400" />}
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                />
            </div>

            {/* টেবিল ভিউ (Desktop) */}
            <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <Table aria-label="Users" removeWrapper>
                    <TableHeader>
                        <TableColumn className="font-bold uppercase text-[11px]">USER</TableColumn>
                        <TableColumn className="font-bold uppercase text-[11px]">ROLE</TableColumn>
                        <TableColumn className="font-bold uppercase text-[11px]">EMAIL</TableColumn>
                        <TableColumn className="font-bold uppercase text-[11px]">STATUS</TableColumn>
                        <TableColumn className="font-bold uppercase text-[11px] text-center">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No users found."}>
                        {filteredUsers.map((user) => {
                            const id = user._id?.$oid || user._id;
                            const isSuspended = user.status === "suspended";

                            return (
                                <TableRow key={id} className="border-b border-zinc-100 dark:border-zinc-800">
                                    <TableCell><User avatarProps={{ src: user.photo }} name={user.name} /></TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="flat" color={user.role === "admin" ? "primary" : "default"}>
                                            {user.role}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="dot" color={isSuspended ? "danger" : "success"}>
                                            {user.status}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Button size="sm" color="danger" variant="flat" isDisabled={isSuspended} onClick={() => handleSuspendUser(id)}>
                                                {isSuspended ? "Suspended" : "Suspend"}
                                            </Button>
                                            <Tooltip content="Delete" color="danger">
                                                <Button isIconOnly size="sm" color="danger" variant="light" isDisabled={isSuspended} onClick={() => handleDeleteUser(id)}>
                                                    <TrashIcon className="w-4 h-4" />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* মোবাইল ভিউ */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredUsers.map((user) => {
                    const id = user._id?.$oid || user._id;
                    const isSuspended = user.status === "suspended";

                    return (
                        <div key={id} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-4">
                            <div className="flex justify-between"><User avatarProps={{ src: user.photo }} name={user.name} description={user.email} /><Chip size="sm" variant="flat">{user.role}</Chip></div>
                            <div className="flex gap-2">
                                <Button fullWidth size="sm" color="danger" variant="flat" isDisabled={isSuspended} onClick={() => handleSuspendUser(id)}>Suspend</Button>
                                <Button isIconOnly size="sm" color="danger" variant="flat" isDisabled={isSuspended} onClick={() => handleDeleteUser(id)}><TrashIcon className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}