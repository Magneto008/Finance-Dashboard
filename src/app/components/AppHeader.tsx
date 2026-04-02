import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Monitor,
  Moon,
  ShieldAlert,
  Sun,
  User,
} from "lucide-react";
import type { Role } from "@/shared/types/finance";
import type { Theme } from "@/app/context/ThemeContext";

type Props = {
  role: Role;
  onSetRole: (role: Role) => void;
  theme: Theme;
  onSetTheme: (theme: Theme) => void;
};

export const AppHeader = ({ role, onSetRole, theme, onSetTheme }: Props) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="size-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight bg-foreground bg-clip-text text-transparent">
            FinanceDash
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 max-sm:hidden">
            {role === "admin" ? (
              <ShieldAlert className="size-5 text-muted-foreground" />
            ) : (
              <User className="size-5 text-muted-foreground" />
            )}
            <Select
              value={role}
              onValueChange={(value) => onSetRole(value as Role)}
            >
              <SelectTrigger className="h-8 w-30 text-xs">
                <SelectValue>
                  {role === "admin" ? "Admin" : "Viewer"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full border border-border"
                >
                  {role === "admin" ? (
                    <ShieldAlert className="size-4" />
                  ) : (
                    <User className="size-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSetRole("admin")}>
                  <ShieldAlert className="size-4 mr-2" />
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSetRole("viewer")}>
                  <User className="size-4 mr-2" />
                  Viewer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full border border-border"
              >
                {theme === "light" ? (
                  <Sun className="size-4" />
                ) : theme === "dark" ? (
                  <Moon className="size-4" />
                ) : (
                  <Monitor className="size-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onSetTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSetTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSetTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
