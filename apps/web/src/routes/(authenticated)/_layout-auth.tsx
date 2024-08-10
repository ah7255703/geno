import { createFileRoute, Link, Outlet, redirect, LinkProps } from '@tanstack/react-router'
import { toast } from 'sonner'
import { motion, useScroll } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPrimitive,
} from "@/components/ui/select"
import {
  SunIcon,
  MoonIcon,
} from "lucide-react";
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useUser } from '@/providers/UserProvider'

const appLinks: {
  to: LinkProps['to'],
  label: string
}[] = [
    {
      to: "/",
      label: "Overview"
    },
    {
      to: "/settings",
      label: "Settings"
    },
    {
      to: "/articles",
      label: "Articles"
    }
  ]


function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  return <Select
    value={theme}
    onValueChange={(value) => {
      if (value === 'system' && systemTheme) {
        setTheme(systemTheme)
        return
      }
      setTheme(value)
    }}
  >
    <SelectPrimitive.SelectTrigger asChild>
      <Button variant='ghost' size='icon'>
        {theme === 'light' ? <SunIcon className='size-4' /> : <MoonIcon className='size-4' />}
      </Button>
    </SelectPrimitive.SelectTrigger>
    <SelectContent>
      <SelectItem value="light">Light</SelectItem>
      <SelectItem value="dark">Dark</SelectItem>
      {systemTheme && <SelectItem value="system">System</SelectItem>}
    </SelectContent>
  </Select>

}

function Header() {
  const user = useUser();
  const scroll = useScroll()
  return <>
    <header className='flex flex-col'>
      <div className='px-4 py-2 flex flex-row justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Geno
          </h2>
        </div>
        <div className='flex items-center gap-1'>
          <Avatar className='size-8'>
            <AvatarImage src={user?.meta.avatarUrl ?? ""} />
            <AvatarFallback className='text-xs'>
              {user?.user?.name[0] ?? "U"}
            </AvatarFallback>
          </Avatar>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
    <div className='px-4 p-2 sticky top-0 z-10 border-b bg-background/60 backdrop-blur-sm'>
    {
      scroll.scrollYProgress.get()
    }
      <nav className='flex flex-row gap-1 items-center'>
        {
          appLinks.map((link) => {
            return <Link to={link.to} key={link.to} className='contents'>
              {({ isActive }) => (
                <>
                  <div className={cn('inline-flex relative px-2 py-1 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', {
                    isActive: "text-popover-foreground"
                  })}>
                    {isActive && <motion.span
                      layoutId='active-link-indicator'
                      className='absolute inset-0 bg-muted/70 rounded-lg'
                    />}
                    <span className='relative'>{link.label}</span>
                  </div>
                </>
              )}
            </Link>
          })
        }
      </nav>
    </div>
  </>
}

export function AuthLayout() {
  return <div>
    <Header />
    <Outlet />
  </div>
}

export const Route = createFileRoute('/(authenticated)/_layout-auth')({
  async beforeLoad({ context }) {
    if (context.user === null) {
      toast.error("You need to be authenticated to access this page")
      return redirect({ to: "/auth" })
    }
  },
  component: AuthLayout
})