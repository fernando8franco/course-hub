import { CalendarIcon } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { type z } from 'zod'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import useRegisterForm from '@/hooks/forms/useRegisterForm'
import useMutateRegister from '@/hooks/useMutateRegister'

interface Props {
  setIsSubmited: (isSubmited: boolean) => void
  setEmail: (email: string) => void
}

export default function RegisterForm ({ setIsSubmited, setEmail }: Props) {
  const { formRegisterSchema, formRegister } = useRegisterForm()
  const { mutateRegister, isPending } = useMutateRegister({ setIsSubmited, setEmail })

  async function onSubmitUserForm (formData: z.infer<typeof formRegisterSchema>) {
    try {
      await mutateRegister(formData)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Card className="mx-auto my-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          Registro
        </CardTitle>
        <CardDescription>
          Llena el siguiente formulario para crear tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...formRegister}>
          <form onSubmit={formRegister.handleSubmit(onSubmitUserForm)}>
            <div className="grid gap-1.5">
              <FormField
                control={formRegister.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-1.5 grid-cols-1 sm:grid-cols-2">
                <FormField
                  control={formRegister.control}
                  name="father_last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido Paterno</FormLabel>
                      <FormControl>
                        <Input placeholder="Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="mother_last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido Materno</FormLabel>
                      <FormControl>
                        <Input placeholder="Hernández" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className='py-[5.5px]'>Fecha de nacimiento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !(field.value != null) && 'text-muted-foreground'
                              )}
                            >
                              {(field.value != null)
                                ? (
                                    format(field.value, 'dd MMM yyyy', { locale: es })
                                  )
                                : (
                                <span>Escoje una fecha</span>
                                  )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            defaultMonth={new Date(2001, 0)}
                            captionLayout="dropdown"
                            fromYear={1925} toYear={2025}
                            locale={es}
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Teléfonico</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567891" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="ejemplo@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type='password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='pt-2'>
                <Button className='w-full' type="submit" disabled={isPending}>
                  {!isPending ? 'Enviar' : 'Enviando'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
