export const formatTime = (date: string) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
};
  
export const formatDate = (date: string) => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { 
    day: "numeric", 
    month: "long", 
    year: "numeric"  
  };

  const formattedDate = d.toLocaleDateString("en-GB", options); 

  const parts = formattedDate.split(" ");
  return `${parts[0]} ${parts[1]}, ${parts[2]}`;
};

  