import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, Form } from '@/components/ui/form'
import { useMutation } from '@tanstack/react-query'
import { client } from '@/honoClient';

const registerValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
})

function RegisterCard() {
  const form = useForm<z.infer<typeof registerValidation>>({
    resolver: zodResolver(registerValidation),
  });

  const register = useMutation({
    mutationFn: client.auth['email-password'].register.$post,
  })

  async function handleSubmit(data: z.infer<typeof registerValidation>) {
    try {
      let res = await register.mutateAsync({
        json: data
      });
      console.log(res)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Card className="max-w-lg w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your email and password to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-2">
              <Field
                control={form.control}
                name="name"
                label="Name"
                render={(f) => <Input {...f} />}
              />

              <Field
                control={form.control}
                name="email"
                label="Email"
                render={(f) => <Input {...f} />}
              />

              <Field
                control={form.control}
                name="password"
                label="Password"
                render={(f) => <Input {...f} type="password" />}
              />

              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              already have an account?{" "}
              <Link to="/auth/" className="underline">
                Login
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>)
}

export const Route = createFileRoute('/auth/register')({
  component: () => <div className='h-screen w-screen items-center justify-center flex'><RegisterCard /></div>
})