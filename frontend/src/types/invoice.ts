export interface InvoiceLineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface ClientInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface StudioInfo {
    logoUrl: string;
    photographerName: string;
    email: string;
    address: string;
    phone: string;
    primaryColor?: string;
}

export interface InvoiceData {
    id?: string;
    number: string;
    issueDate: string;
    dueDate: string;
    client: ClientInfo;
    items: InvoiceLineItem[];
    taxRate: number;
    includeTax: boolean;
    studio: StudioInfo;
    amountPaid?: number;
    totalAmount?: number;
    status?: string;
}
