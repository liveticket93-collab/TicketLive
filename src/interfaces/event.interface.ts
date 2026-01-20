export default interface IEvent {
  id: number;
  title: string;
  description: string;
  date: Date;
  start_time: string;
  end_time: string;
  location: string;
  capacity: number;
  price: number;
  imageUrl: string;
  status: boolean;
  categoryId: string;
}