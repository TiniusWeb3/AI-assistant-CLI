import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CalendarView from "@/components/CalendarView";
import AddEventDialog from "@/components/AddEventDialog";

export default function Calendar() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {isLoading ? (
        <div>Loading events...</div>
      ) : (
        <CalendarView events={events || []} />
      )}

      <AddEventDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
