export const formatDate = (date: Date): string => {
    return date.toISOString();
  };
  
  export const addMinutes = (date: Date, minutes: number): Date => {
    return new Date(date.getTime() + minutes * 60000);
  };
  
  export const isExpired = (expiryDate: Date): boolean => {
    return new Date() > expiryDate;
  };
  
  export const getExpiryTime = (minutes: number = 10): Date => {
    return addMinutes(new Date(), minutes);
  };