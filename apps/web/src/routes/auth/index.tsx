import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { client } from '@/honoClient'
import { useAuthContext } from '@/providers/AuthProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const loginValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

function LoginCard() {
  const { login: logintheuser } = useAuthContext()
  const form = useForm<z.infer<typeof loginValidation>>({
    resolver: zodResolver(loginValidation),
  })

  const login = useMutation({
    mutationFn: client.auth['email-password'].login.$post,
  })

  async function handleSubmit(_data: z.infer<typeof loginValidation>) {
    const res = await login.mutateAsync({
      json: _data,
    });

    const data = await res.json();
    if (res.status === 200 && "accessToken" in data) {
      logintheuser(data);
      toast.success("Logged in successfully");
      return;
    }
    if (res.status === 404 && "error" in data) {
      toast.error(data.error);
    }
  }

  return (
    <Card className="max-w-lg w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Form {...form}>
            <div className="grid gap-2">
              <Field
                control={form.control}
                name='email'
                label='Email'
                render={(f) => <Input {...f} />}
              />
              <Field
                control={form.control}
                name='password'
                label='Password'
                render={(f) => <Input type='password' {...f} />}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/auth/register" className="underline">
                Sign up
              </Link>
            </div>
          </Form>
        </form>
      </CardContent>
    </Card>)
}

export const Route = createFileRoute('/auth/')({
  component: () => <div className='flex items-center justify-center h-screen'>
    <LoginCard />
  </div>
})