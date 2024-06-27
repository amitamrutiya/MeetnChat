"use client";

import { X } from "lucide-react";
import { Badge, Command, CommandGroup, CommandItem, CommandList } from "@repo/ui";
import { Command as CommandPrimitive } from "cmdk";
import { useRef, useState, useCallback } from "react";
import { User } from "@prisma/client";
import { useRecoilState, useRecoilValue } from "recoil";
import { inviteUserListAtom, selectedAtom } from "@repo/store";

export function FancyMultiSelect() {
  const [selected, setSelected] = useRecoilState(selectedAtom);
  const users = useRecoilValue(inviteUserListAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback((user: User) => {
    //@ts-ignore
    setSelected((prev: User[]) => prev.filter((s: User) => s.id !== user.id));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          //@ts-ignore
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, []);

  const selectables = users.filter((user: User) => !selected.includes(user));
  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="border-input ring-offset-background focus-within:ring-ring group rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((user: User) => {
            return (
              <Badge key={user.id} variant="secondary">
                {user.name}
                <button
                  className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(user);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(user)}
                >
                  <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select users..."
            className="placeholder:text-muted-foreground ml-2 flex-1 bg-transparent outline-none"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((user: User) => {
                  return (
                    <CommandItem
                      key={user.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue("");
                        //@ts-ignore
                        setSelected((prev) => [...prev, user]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {user.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
