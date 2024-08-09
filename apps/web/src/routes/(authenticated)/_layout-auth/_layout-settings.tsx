import { createFileRoute } from '@tanstack/react-router'
import { Link, Outlet } from '@tanstack/react-router'
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function SettingsLayout() {
  return <div className="flex items-start gap-5 p-10 flex-col lg:flex-row w-full">

    <aside className="lg:max-w-sm w-full space-y-5">
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <nav
        className={
          "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1"
        }
      >
        <Link
          activeOptions={{
            exact: true,
          }}
          to={"/settings"}
          viewTransition
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "data-[status=active]:bg-muted justify-start data-[status=active]:hover:bg-muted hover:bg-transparent hover:underline",
          )}
        >
          Profile Settings
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

    <div className="lg:flex-1 w-full">
      <Outlet />
    </div>
  </div>
}

export const Route = createFileRoute('/(authenticated)/_layout-auth/_layout-settings')({
  component: SettingsLayout
})