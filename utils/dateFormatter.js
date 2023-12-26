exports.formatDate = (date, format = 'yyyy-mm-dd') => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };

  if (format === 'dd/mm/yyyy') {
    return new Date(date).toLocaleDateString('en-GB', options);
  } else {
    return new Date(date).toISOString().split('T')[0];
  }
};
