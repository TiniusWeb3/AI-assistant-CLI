import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Task, Event } from "@shared/schema";
import TaskList from "@/components/TaskList";
import CalendarView from "@/components/CalendarView";

export default function Home() {
  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div>Loading tasks...</div>
            ) : (
              <TaskList tasks={tasks?.slice(0, 5) || []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <div>Loading events...</div>
            ) : (
              <CalendarView events={events?.slice(0, 5) || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
