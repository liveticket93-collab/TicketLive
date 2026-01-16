import IEvent from "@/interfaces/event.interface";

export interface ICategory {
  id: string;
  name: string;
}

export const getEvents = async (): Promise<IEvent[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
};

export const getEvent = async (id: string): Promise<IEvent> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch event");
  }

  return res.json();
}

export const getEventCategories = async (): Promise<ICategory[]> => {
  const res = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    return res.json();
}

export const dateFormatter = (date: Date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
} 