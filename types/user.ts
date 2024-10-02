export interface User {
    counter: number;
    todayAmount: number;
    totalAmount: number;
    status?: string;
    wallet?: string;
  }
  
  export interface Task {
    status: string;
    timestamp: string;
  }
  