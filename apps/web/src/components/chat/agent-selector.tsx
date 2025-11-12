import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Agent } from "@/types/chat";

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgentId: string;
  onSelectAgent: (agentId: string) => void;
}

export function AgentSelector({
  agents,
  selectedAgentId,
  onSelectAgent,
}: AgentSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between sm:w-[280px]"
        >
          {selectedAgent ? (
            <div className="flex items-center gap-2">
              <Avatar
                className="h-6 w-6"
                style={{ backgroundColor: selectedAgent.color }}
              >
                <AvatarFallback
                  className="text-xs text-white"
                  style={{ backgroundColor: selectedAgent.color }}
                >
                  {selectedAgent.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{selectedAgent.name}</span>
            </div>
          ) : (
            "Select agent..."
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Search agents..." />
          <CommandList>
            <CommandEmpty>No agent found.</CommandEmpty>
            <CommandGroup>
              {agents.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={agent.id}
                  onSelect={() => {
                    onSelectAgent(agent.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedAgentId === agent.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <Avatar
                    className="mr-2 h-6 w-6"
                    style={{ backgroundColor: agent.color }}
                  >
                    <AvatarFallback
                      className="text-xs text-white"
                      style={{ backgroundColor: agent.color }}
                    >
                      {agent.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{agent.name}</span>
                    {agent.description && (
                      <span className="text-xs text-neutral-500">
                        {agent.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
