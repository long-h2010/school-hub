import dayjs from 'dayjs';

export const formatDate = (date: Date | string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

export const formatDateWithNoTime = (date: Date | string) => {
  return dayjs(date).format('DD/MM/YYYY');
};
