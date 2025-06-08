export const formatEGP = (number) => {
  if (!number && number !== 0) return '';
  
  // Convert to number if it's a string
  const num = typeof number === 'string' ? parseFloat(number) : number;
  
  // Format with 2 decimal places and thousands separator using Arabic locale
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    
  }).format(num);
}; 