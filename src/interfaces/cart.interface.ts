import IEvent from "./event.interface";

export interface ICartItem {
  id: string;        
  event: IEvent;    
  quantity: number;
  unitPrice: number;
}
