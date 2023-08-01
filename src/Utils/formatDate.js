export function formatDate(input) {
    let date;
    date = input ? new Date(input) : new Date()
    // date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    
    return formattedDate;
  }