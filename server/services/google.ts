import { GoogleEvent } from "@shared/types";
import { authService } from "./auth";

export class GoogleService {
  private baseUrl = "https://www.googleapis.com/calendar/v3";

  async getEvents(): Promise<GoogleEvent[]> {
    const token = await authService.getToken("google");
    if (!token) throw new Error("Not authenticated with Google");

    const res = await fetch(`${this.baseUrl}/calendars/primary/events`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        const newToken = await authService.refreshToken("google");
        if (!newToken) throw new Error("Failed to refresh token");
        return this.getEvents();
      }
      throw new Error("Failed to fetch events from Google");
    }

    const data = await res.json();
    return data.items.map((event: any): GoogleEvent => ({
      id: event.id,
      title: event.summary,
      description: event.description,
      startTime: new Date(event.start.dateTime || event.start.date),
      endTime: new Date(event.end.dateTime || event.end.date),
    }));
  }

  async createEvent(event: Partial<GoogleEvent>): Promise<GoogleEvent> {
    const token = await authService.getToken("google");
    if (!token) throw new Error("Not authenticated with Google");

    const res = await fetch(`${this.baseUrl}/calendars/primary/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.startTime?.toISOString(),
        },
        end: {
          dateTime: event.endTime?.toISOString(),
        },
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create event in Google Calendar");
    }

    const data = await res.json();
    return {
      id: data.id,
      title: data.summary,
      description: data.description,
      startTime: new Date(data.start.dateTime || data.start.date),
      endTime: new Date(data.end.dateTime || data.end.date),
    };
  }
}

export const googleService = new GoogleService();
