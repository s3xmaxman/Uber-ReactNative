import { Ride } from "@/types/type";

export const sortRides = (rides: Ride[]): Ride[] => {
  const result = rides.sort((a, b) => {
    const dateA = new Date(`${a.created_at}T${a.ride_time}`);
    const dateB = new Date(`${b.created_at}T${b.ride_time}`);
    return dateB.getTime() - dateA.getTime();
  });

  return result.reverse();
};

export function formatTime(minutes: number): string {
  const formattedMinutes = +minutes?.toFixed(0) || 0;

  if (formattedMinutes < 60) {
    return `${minutes}分`;
  } else {
    const hours = Math.floor(formattedMinutes / 60);
    const remainingMinutes = formattedMinutes % 60;
    return `${hours}時間${
      remainingMinutes > 0 ? ` ${remainingMinutes}分` : ""
    }`;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}/${month < 10 ? `0${month}` : month}/${
    day < 10 ? `0${day}` : day
  }`;
}
