import { agents } from "@/data/agents"
import type { SupportAgent, SupportCase } from "@/types/supportCase"

import { tableFeatures, useTable, type ColumnDef } from "@tanstack/react-table"
import { Badge } from "./ui/badge"
import { SPECIALTY_MAP } from "./agentCard"
import { useEffect, useState } from "react"
import { fetchCases } from "@/data/mockApi"

const features = tableFeatures({})

export function AgentsTable() {
    const [tickets, setTickets] = useState<SupportCase[]>([])
    const [dataState, setDataState] = useState<"loading" | "error" | "ready">("loading");
    const [errorMessage, setErrorMessage] = useState("");
    
    useEffect(() => {
        let cancelled = false;

        setDataState("loading");
        setErrorMessage("");

        fetchCases()
        .then((data) => {
            if (!cancelled) {
            setTickets(data);
            setDataState("ready");
            }
        })
        .catch((err) => {
            if (!cancelled) {
            setDataState("error");
            setErrorMessage(
                err instanceof Error ? err.message : "An unexpected error occurred",
            );
            }
        });

        return () => {
        cancelled = true;
        };
    }, []);

    const columns: Array<ColumnDef<typeof features, SupportAgent>> = [
        {
            accessorKey: "firstName",
            header: "Agents",
            cell: (info) => {
                return (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>{info.row.original.firstName} {info.row.original.lastName}</span>
                        <span>{info.row.original.email}</span>
                    </div>
                )
            }
        },

        {
            accessorKey: "area",
            header: "Area",
            cell: (info) => {
                const specialtyInfo = SPECIALTY_MAP[info.row.original.specialty];
                
                return (
                    <Badge variant={specialtyInfo.variant}>
                        {specialtyInfo.label}
                    </Badge>
                )
            }
        },

        {
            accessorKey: "ticketCount",
            header: "Ticket count",
            cell: (info) => {
                const ticketCount = tickets.filter((ticket) => ticket.agentId === info.row.original.id).length;

                return (
                    <span>{ticketCount}</span>
                )
            }
        }
    ]

    const table = useTable({
        key: "agents",
        features,
        columns,
        data: agents,
    })

    return (
        <table>
        <thead>
            {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                <th key={header.id}>
                    {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                    )}
                </th>
                ))}
            </tr>
            ))}
        </thead>
        <tbody>
            {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
                {row.getAllCells().map((cell) => (
                <td key={cell.id}>
                    <table.FlexRender cell={cell} />
                </td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    )
}