export interface getFilterTask {
    sortAsc: boolean,
    dueDate: Date,
    beforeDate: boolean | undefined,
    taskName: string,
    userAssignedId: number[],
    nameAsignee: string,
    emailAsignee: string
}