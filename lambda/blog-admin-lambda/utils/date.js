// Get current date in Persian format
function getCurrentDate() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear() % 100;
  const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 
                         'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  return `${persianMonths[month - 1]} ${year.toString().padStart(2, '0')}`;
}

module.exports = {
  getCurrentDate
};

