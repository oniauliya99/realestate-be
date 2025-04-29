import { dateFormatterType } from './types/date-formatter.type';

export function dateTimeFormatter(date: Date | null, locale: string = 'id') {
  if (!date) return null;
  return date
    .toLocaleString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    .replace(', ', ' ');
}

export function dateFormatter({
  date = new Date(),
  locale = 'id',
  addDay = 0,
  format = '%d %MMMM %Y'
}: dateFormatterType) {
  if (!date) return;
  date.setDate(date.getDate() + addDay);
  const year = date.toLocaleString(locale, {
    year: format.indexOf('%Y') > -1 ? 'numeric' : '2-digit'
  });
  const month = date.toLocaleString(locale, {
    month:
      format.toUpperCase().indexOf('%MMMM') > -1
        ? 'long'
        : format.toUpperCase().indexOf('%MMM') > -1
          ? 'short'
          : format.toLowerCase().indexOf('%mm') > -1
            ? '2-digit'
            : format.indexOf('%m') > -1
              ? 'numeric'
              : 'narrow'
  });
  const day = date.toLocaleString(locale, {
    day: format.indexOf('%D') > -1 ? '2-digit' : 'numeric'
  });
  format = format.replaceAll('%Y', year);
  format = format.replaceAll('%y', year);
  format = format.replaceAll('%MMMM', month);
  format = format.replaceAll('%mmmm', month);
  format = format.replaceAll('%MMM', month);
  format = format.replaceAll('%mmm', month);
  format = format.replaceAll('%MM', month);
  format = format.replaceAll('%mm', month);
  format = format.replaceAll('%M', month);
  format = format.replaceAll('%m', month);
  format = format.replaceAll('%D', day);
  format = format.replaceAll('%d', day);

  return format;
}

export function stringDateFormat(value: string, locale: string = 'id') {
  if (!value) return;
  let splitted = value.split(/[^0-9]/);
  if (
    splitted.length >= 2 &&
    parseInt(splitted[0]) > 0 &&
    parseInt(splitted[splitted.length - 1]) > 0 &&
    (splitted[splitted.length - 1].length == 2 ||
      splitted[splitted.length - 1].length == 4)
  ) {
    if (value.match(/[a-zA-Z]/g)) {
      const namaBulan = [
        ['jan', 'januari', 'jan', 'january'],
        ['feb', 'februari', 'feb', 'february'],
        ['peb', 'pebruari', 'feb', 'february'],
        ['mar', 'maret', 'mar', 'march'],
        ['apr', 'april', 'apr', 'april'],
        ['mei', 'mei', 'may', 'may'],
        ['jun', 'juni', 'jun', 'june'],
        ['jul', 'juli', 'jul', 'july'],
        ['agu', 'agustus', 'aug', 'august'],
        ['sep', 'september', 'sep', 'september'],
        ['okt', 'oktober', 'oct', 'october'],
        ['nov', 'november', 'nov', 'november'],
        ['des', 'desember', 'dec', 'december']
      ];
      let founded = false;
      namaBulan.forEach((element) => {
        if (value.toLowerCase().indexOf(element[2]) > -1) founded = true;
        if (value.toLowerCase().indexOf(element[3]) > -1) founded = true;
        if (
          value.toLowerCase().indexOf(element[0]) > -1 ||
          value.toLowerCase().indexOf(element[1]) > -1
        ) {
          value = value.toLowerCase().replaceAll(element[1], element[2]);
          value = value.toLowerCase().replaceAll(element[0], element[2]);
          founded = true;
          return;
        }
      });
      if (!founded) return;
      return value;
    } else {
      if (splitted.length == 3) {
        if (splitted[2].length == 2) {
          splitted[2] = new Date(`15 jun ${splitted[2]}`).toLocaleString(
            locale,
            {
              year: 'numeric'
            }
          );
        }
        value = `${splitted[2]} ${splitted[1]} ${splitted[0]}`;
        return value;
      }
    }
  }
  return;
}

export function isValidDate(date) {
  return (
    date &&
    Object.prototype.toString.call(date) === '[object Date]' &&
    !isNaN(date)
  );
}

export function toDate(value: string): Date {
  const date = new Date(value);
  var userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - userTimezoneOffset);
}

export function parsePromoDate(dateString: string) {
  // console.log(dateString);
  if (!dateString) return null;

  const [datePart, timePart] = dateString?.split(' ');
  const [day, month, year] = datePart?.split('/').map(Number);
  const [hours, minutes, seconds] = timePart?.split(':').map(Number);

  const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);

  if (isNaN(parsedDate.getTime())) {
    console.error('Invalid date string:', dateString);
    return null; // Return null for invalid dates
  }

  return toDate(parsedDate as any) ?? new Date();
}

export function parseDateLocal(dateString: string) {
  // console.log('Input dateString:', dateString, 'Type:', typeof dateString);
  if (typeof dateString !== 'string' || !dateString) return null;

  const [datePart, timePart] = dateString.split(' ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes, seconds] = timePart
    ? timePart.split(':').map(Number)
    : [0, 0, 0];

  const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);

  if (isNaN(parsedDate.getTime())) {
    console.error('Invalid date string:', dateString);
    return null;
  }

  return parsedDate;
}
