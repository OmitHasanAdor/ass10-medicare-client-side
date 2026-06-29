"use client";

import React from "react";
import { Table, Chip } from "@heroui/react";
import { User, Stethoscope, Phone, CreditCard } from "lucide-react";

export default function AppointmentTable({ appointments }) {
    const statusColorMap = {
        pending: "warning",
        confirmed: "primary",
        completed: "success",
        cancelled: "danger",
    };

    const renderTableRows = () => {
        if (!appointments || appointments.length === 0) {
            return (
                <Table.Row>
                    <Table.Cell colSpan={5}>
                        <p className="text-center py-4 text-muted-foreground">
                            No appointments found in the system.
                        </p>
                    </Table.Cell>
                </Table.Row>
            );
        }

        return appointments.map((item) => (
            <Table.Row key={item._id}>
                {/* পেশেন্ট ডিটেইলস */}
                <Table.Cell>
                    <div className="flex flex-col gap-1 py-1">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <User className="size-3.5 text-default-400" />
                            {item.patientName || item.patientEmail || "Unknown Patient"}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {item.patientEmail}
                        </span>
                    </div>
                </Table.Cell>

                {/* ডক্টর ডিটেইলস */}
                <Table.Cell>
                    <div className="flex flex-col gap-1 py-1">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <Stethoscope className="size-3.5 text-default-400" />
                            {item.doctorName || "Assigned Doctor"}
                        </span>
                        <span className="text-xs text-muted-foreground pl-5">
                            {item.specialization || "General Physician"}
                        </span>
                    </div>
                </Table.Cell>

                {/* ডেট এবং টাইম */}
                <Table.Cell>
                    <div className="flex flex-col gap-0.5 text-sm py-1">
                        <span className="font-medium text-foreground">{item.appointmentDate}</span>
                        <span className="text-xs text-muted-foreground">{item.appointmentTime}</span>
                    </div>
                </Table.Cell>

                {/* ফি এবং পেমেন্ট মেথড */}
                <Table.Cell>
                    <div className="flex flex-col gap-1 text-sm py-1">
                        <span className="font-semibold text-foreground">
                            ৳ {item.amountPaid || 0}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CreditCard className="size-3 text-default-400" />
                            {item.paymentStatus || "unpaid"}
                        </span>
                    </div>
                </Table.Cell>

                {/* স্ট্যাটাস ব্যাজ */}
                <Table.Cell>
                    <Chip
                        className="capitalize border-none min-w-23.75 text-center font-medium"
                        color={statusColorMap[item.appointmentStatus?.toLowerCase()] || "default"}
                        size="sm"
                        variant="flat"
                    >
                        {item.appointmentStatus || "Unknown"}
                    </Chip>
                </Table.Cell>
            </Table.Row>
        ));
    };

    return (
        <Table>
            <Table.ScrollContainer>
                <Table.Content aria-label="Clinical Appointments Table">
                    <Table.Header>
                        {/* isRowHeader true kora error complete dur korar jonno */}
                        <Table.Column isRowHeader>PATIENT & CONTACT</Table.Column>
                        <Table.Column>ASSIGNED DOCTOR</Table.Column>
                        <Table.Column>SCHEDULED DATE & TIME</Table.Column>
                        <Table.Column>FEES & PAYMENT</Table.Column>
                        <Table.Column>STATUS</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {renderTableRows()}
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table>
    );
}