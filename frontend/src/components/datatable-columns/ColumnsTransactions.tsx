import { ArrowUpDown } from 'lucide-react'
import { type ColumnDef } from '@tanstack/react-table'
import { type Transaction } from '@/type'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import StatusBadge from '../react-components/StatusBadge'
import CheckImage from '../react-components/CheckImage'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import DeleteDialog from '../react-components/DeleteDialog'

export const ColumnsTransactions: Array<ColumnDef<Transaction>> = [
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => { column.toggleSorting(column.getIsSorted() === 'asc') }}
        >
          Datos transacción
        <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    accessorKey: 'date_purchase',
    cell: ({ row }) => {
      const date: Date = row.getValue('date_purchase')
      const formattedDate = format(date, 'dd MMM yyyy', { locale: es })
      const transaction = row.original

      return (
        <div className='flex flex-col gap-2'>
          <p>Fecha: {formattedDate}</p>
          <p>Total: { parseFloat(transaction.total_amount).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) }</p>
        </div>
      )
    }
  },
  {
    header: () => <div className="text-center">Estado</div>,
    accessorKey: 'transaction_state',
    cell: ({ row }) => {
      const transactionState: string = row.getValue('transaction_state')

      return <StatusBadge transactionState={transactionState} />
    }
  },
  {
    header: () => <div className="text-center">Recibo</div>,
    accessorKey: 'image',
    cell: ({ row }) => {
      const image: string = row.getValue('image')

      if (image === null) {
        return (
        <div className='text-center'>
          <Badge variant='destructive'>Sin recibo</Badge>
        </div>
        )
      }

      return <CheckImage image={image} />
    }
  },
  {
    header: () => <div className="text-center">Usuario</div>,
    accessorKey: 'name',
    cell: ({ row }) => {
      const name: string = row.getValue('name')
      const transaction = row.original

      return (
        <div>
          <p>{name}</p>
          <p>{transaction.father_last_name} {transaction.mother_last_name}</p>
        </div>
      )
    }
  },
  {
    header: () => <div className="text-center">Contacto</div>,
    accessorKey: 'email',
    cell: ({ row }) => {
      const email: string = row.getValue('email')
      const transaction = row.original

      return (
        <div className='text-center'>
          <p>{email}</p>
          <p>{transaction.phone_number}</p>
        </div>
      )
    }
  },
  {
    header: () => <div className="text-center">Curso</div>,
    accessorKey: 'course_name',
    cell: ({ row }) => {
      const courseName: string = row.getValue('course_name')
      const transaction = row.original

      return (
        <div className='text-center'>
          <p className='pb-2'>{courseName}</p>
          {transaction.course_is_active === 1 && <Badge variant='success'>Activo</Badge>}
          {transaction.course_is_active === 0 && <Badge variant='destructive'>Inactivo</Badge>}
        </div>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original
      return (
        <DeleteDialog
        transactionId={transaction.transaction_id}
        />
      )
    }
  }
]
