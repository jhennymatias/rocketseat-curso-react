import { Container } from "./styles";
import { useTransactions } from './../../hooks/useTransaction';

export default function TransactionsTable() {
  const {transactions} = useTransactions();
  console.log(transactions)

  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
        {transactions.map(transaction => (
          <tr key={transaction.id}>
            <td>{transaction.title}</td>
            <td className={transaction.type}>{new Intl.NumberFormat('pt-BR', {style: 'currency',currency:'BRL'}).format(transaction.value)}</td>
            <td>{transaction.category}</td>
            <td>{new Intl.DateTimeFormat().format(new Date(transaction.createdAt))}</td>
          </tr>

        ))}
          
        </tbody>
      </table>
    </Container>
  )
}