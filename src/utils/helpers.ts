import { isBoolean } from 'class-validator';
import { json } from 'stream/consumers';

type valueType = {
  String?: string;
  Number?: number;
  Date?: Date;
  Boolean?: boolean;
  Json?: JSON;
};

enum ValueOperators {
  CONTAINS = 'contains.'
}

export const countSkip = (page: number, take: number) =>
  page < 1 ? 0 : (page - 1) * take;

export const mapQueryFilter = (input: string, value?: valueType) =>
  input
    .split(',')
    ?.map((a) => a.split(':'))
    ?.reduce((outerObj, [key, val]: any) => {
      if (val === undefined) {
        return outerObj;
      }
      const checkNumber = parseInt(val, 10);
      if (!isNaN(checkNumber)) val = checkNumber;
      let jsonVal = undefined;
      if (key.includes('$')) {
        const keys = key.split('$');
        jsonVal = {
          path: `$${keys.pop()}`,
          equals: Boolean(val) ? val.toLowerCase() == 'true' : val
        };
        key = keys.pop();
        key = key.substring(0, key.length - 1);
      }

      if (!key.includes('.')) {
        outerObj[key] = jsonVal
          ? jsonVal
          : value
            ? getQueryValue(val, value)
            : val;
        return outerObj;
      }

      const keys = key.split('.');
      const lastKey = keys.pop();
      const lastObj = keys.reduce((a, key) => {
        if (!a[key]) {
          a[key] = {};
        }
        return a[key];
      }, outerObj);

      lastObj[lastKey] = jsonVal
        ? jsonVal
        : value
          ? getQueryValue(val, value)
          : val;

      return outerObj;
    }, {});

function getQueryValue(val, value) {
  if (val.indexOf(ValueOperators.CONTAINS) === 0) {
    const valObj = {
      [ValueOperators.CONTAINS.replace('.', '')]: value.String
        ? value.String
        : value.Number
          ? value.Number
          : value.Date
            ? value.Date
            : value.Json
    };
    return valObj;
  } else {
    return value.String
      ? value.String
      : value.Number
        ? value.Number
        : value.Date
          ? value.Date
          : value.Json;
  }
}

export const setFiltersAndSearch = (
  filters: string,
  filtersObj: any,
  searchString: string[],
  searchStringField: string[],
  searchDate: Date[],
  searchDateField: string[],
  searchNumber: number[],
  searchNumberField: string[]
) => {
  let where = {};
  if (filters) {
    where = {
      ...where,
      ...mapQueryFilter(filters)
    };
  }
  if (filtersObj) {
    where = {
      ...where,
      ...filtersObj
    };
  }
  let whereString = {};
  if (
    searchString &&
    searchString.length > 0 &&
    searchStringField &&
    searchStringField.length > 0
  ) {
    whereString = {
      AND: searchString.map((search) => {
        return {
          OR: searchStringField.map((field) => {
            return {
              ...(field.includes('$')
                ? mapQueryFilter(
                    `${field
                      .split('$')[0]
                      .substring(0, field.split('$')[0].length - 1)}:`,
                    {
                      Json: JSON.parse(
                        `{ "path": "$${field
                          .split('$')
                          .pop()}", "string_contains": "${search.toLowerCase()}" }`
                      )
                    }
                  )
                : mapQueryFilter(
                    `${field}:${ValueOperators.CONTAINS}${search}`,
                    {
                      String: search
                    }
                  ))
            };
          })
        };
      })
    };
  }
  let whereDate = {};
  if (
    searchDate &&
    searchDate.length > 0 &&
    searchDateField &&
    searchDateField.length > 0
  ) {
    whereDate = {
      AND: searchDate.map((search) => {
        return {
          OR: searchDateField.map((field) => {
            //return { [field]: search };
            return {
              ...mapQueryFilter(`${field}:${search}`, {
                Date: search
              })
            };
          })
        };
      })
    };
  }
  let whereNumber = {};
  if (
    searchNumber &&
    searchNumber.length > 0 &&
    searchNumberField &&
    searchNumberField.length > 0
  ) {
    whereNumber = {
      AND: searchNumber.map((search) => {
        return {
          OR: searchNumberField.map((field) => {
            //return { [field]: search };
            return {
              ...mapQueryFilter(`${field}:${search}`, {
                Number: search
              })
            };
          })
        };
      })
    };
  }
  where = {
    ...where,
    AND: [whereString, whereDate, whereNumber]
  };

  return where;
};

export const asyncCallWithTimeout = async (
  asyncPromise,
  timeLimit: number = 1000 // default timeout 3 seconds
) => {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise((_resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Async call timeout limit reached')),
      timeLimit
    );
  });

  return Promise.race([asyncPromise, timeoutPromise])
    .then((result) => {
      clearTimeout(timeoutHandle);
      return result;
    })
    .catch(() => {
      clearTimeout(timeoutHandle);
      return undefined;
    });
};

export const omitSet = (obj, exclude) =>
  Object.keys(obj)
    .filter((k) => !exclude.includes(k))
    .reduce((acc, key) => ((acc[key] = obj[key]), acc), {});

export function calculateDiscount(
  amount: number,
  discountPercentage: number
): number {
  const discount = amount * (discountPercentage / 100);
  return amount - discount;
}

export const getFilterValue = (filters: string, key: string): string | null => {
  const pairs = filters.split(',').map((filter) => filter.trim());
  return pairs.reduce((acc, filter) => {
    const [filterKey, value] = filter.split(':').map((part) => part.trim());
    return filterKey === key ? value : acc;
  }, null);
};

export const formatCurrency = (amount: number | null | undefined) =>
  amount?.toLocaleString() ?? '0';

// Helper function to format date
export const formatDate = (date: Date | string) =>
  new Date(date).toLocaleString('id-ID');
