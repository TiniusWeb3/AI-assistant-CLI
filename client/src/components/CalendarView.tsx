import { Event } from "@shared/schema";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

interface CalendarViewProps {
  events: Event[];
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const eventsForDate = selectedDate
    ? events.filter(
        (event) =>
          format(new Date(event.startTime), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  return (
    <div className="grid md:grid-cols-[300px,1fr] gap-6">
      <Card>
        <CardContent className="p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium mb-4">
            Events for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Today"}
          </h3>
          <div className="space-y-4">
            {eventsForDate.length === 0 ? (
              <p className="text-muted-foreground">No events scheduled</p>
            ) : (
              eventsForDate.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col gap-1 p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <h4 className="font-medium">{event.title}</h4>
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(event.startTime), "h:mm a")} -{" "}
                    {format(new Date(event.endTime), "h:mm a")}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
