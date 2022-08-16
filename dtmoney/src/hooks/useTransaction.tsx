import { createContext, ReactNode, useEffect, useState, useContext } from "react";
import { api } from "../services/api";

interface Transaction {
    id: number,
    title: string,
    category: string,
    type: string
    value: number,
    createdAt: string
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt' >

interface TrasactionProviderProps{
    children: ReactNode;
}

interface TransactionContextData {
    transactions: Transaction[];
    createTransaction: (transaction:TransactionInput) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextData>(
    {} as TransactionContextData 
);

export function TransactionProvider({children}:TrasactionProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        api.get('transactions')
            .then(response => setTransactions(response.data.transactions))
    }, [])

    async function createTransaction(transactionInput : TransactionInput){
        const response = await api.post('/transactions', {...transactionInput, createdAt: new Date()});
        const {transaction} = response.data;
        setTransactions([...transactions, transaction])
    }
    return(
        <TransactionContext.Provider value={{transactions, createTransaction}}>
            {children}
        </TransactionContext.Provider>
    )

}

export function useTransactions(){
    const context = useContext(TransactionContext);
    return context;
}