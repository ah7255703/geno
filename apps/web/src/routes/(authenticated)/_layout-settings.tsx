import { useUser } from '@/providers/UserProvider'
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'


export const Route = createFileRoute('/(authenticated)/_layout-settings')({
  async beforeLoad({ context }) {
    if (context.user === null) {
      toast.error("You need to be authenticated to access this page")
      return redirect({ to: "/auth" })
    }
  },
  component: () => {
    const { authenticated } = useUser();
    if (!authenticated) {
      return <div>Protected!</div>
    }
    return <div>

      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <nav
              className={
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1"
              }
            >
              <Link
                to={"/settings/general"}

                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "data-[status=active]:bg-muted justify-start data-[status=active]:hover:bg-muted hover:bg-transparent hover:underline",
                )}
              >
                General Settings
              </Link>
              <Link
                to={"/settings/apperance"}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "data-[status=active]:bg-muted justify-start data-[status=active]:hover:bg-muted hover:bg-transparent hover:underline",
                )}
              >
                Appearance
              </Link>
              <Link
                to={"/settings/social-accounts"}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "data-[status=active]:bg-muted justify-start data-[status=active]:hover:bg-muted hover:bg-transparent hover:underline",
                )}
              >
                Social Accounts
              </Link>
            </nav>
          </aside>
          <div className="flex-1 lg:max-w-2xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  }
})