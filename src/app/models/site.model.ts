export interface PaymentProxy {
    date: string | null;
    amount: number | null;
    description: string;
}

export interface Site {
    id?: number;
    name: string;
    location: string;
    type: string;
    status: string;
    total_budget: number;
    advance_received: number;
    remaining_balance?: number;
    payments?: PaymentProxy[];
    created_at?: string;
    updated_at?: string;
}
