const statusMap: Record<number, string> = {
    0: "new",
    1: "in progress",
    2: "reviewing",
    3: "close",
};

export function getStatusString(status: number) {
    return statusMap[status] || "unknown";
}