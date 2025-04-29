import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  isValidDate,
  stringDateFormat,
  toDate
} from 'src/utils/date-formatter';
import { countSkip, setFiltersAndSearch } from 'src/utils/helpers';
import { isNumeric } from 'src/utils/numeric';

@Injectable()
export class PrismaService extends PrismaClient {
  async findAndCountAll(prismaObject) {
    const {
      table,
      where: whereItem,
      skip: skipItem,
      orderBy,
      ...object
    } = prismaObject;
    const {
      filters,
      filtersObj,
      search,
      searchStringField,
      searchDateField,
      searchNumberField
    } = whereItem;
    const { page, take } = skipItem;

    let searchString: string[] = [];
    const searchDate: Date[] = [];
    const searchNumber: number[] = [];

    if (search) {
      searchString = search.split(' ');
      if (searchString.length > 0) {
        // DISINI MEMBAGI ANTARA SEARCH STRING DAN DATE
        if (searchDateField && searchDateField.length > 0) {
          let dummyString: string;
          let dummyDate: Date;
          for (let n = 2; n >= 0; n - 1) {
            let m = 0;
            while (m <= searchString.length - 1 - n) {
              dummyString = '';
              for (let o = 0; o < n + 1; o + 1) {
                dummyString = `${dummyString} ${searchString[m + o]}`;
              }
              dummyDate = toDate(stringDateFormat(dummyString.trim()));
              if (isValidDate(dummyDate)) {
                searchDate.push(dummyDate);
                searchString.splice(m, n + 1);
              } else {
                m += 1;
              }
            }
          }
        }
        // DISINI MEMBAGI ANTARA SEARCH STRING DAN NUMBER
        if (searchNumberField && searchNumberField.length > 0) {
          let dummyNumber: number;
          let m = 0;
          while (m <= searchString.length - 1) {
            dummyNumber = parseInt(searchString[m], 10);
            if (isNumeric(dummyNumber)) {
              searchNumber.push(dummyNumber);
              searchString.splice(m, 1);
            } else {
              m += 1;
            }
          }
        }
        // console.log('Numbers : ', searchNumber, searchNumberField);
        // console.log('Dates : ', searchDate, searchDateField);
        // console.log('Strings : ', searchString, searchStringField);
      }
    }
    // console.log(searchString)
    let newOrderBy: object = null;
    if (Object.keys(orderBy).length === 1) {
      const keys = Object.keys(orderBy)[0];
      const value = orderBy[keys];
      newOrderBy = keys
        .split('.')
        .reverse()
        .reduce((acc, val) => {
          if (Object.keys(acc).length === 0) return { [val]: value };
          return { [val]: acc };
        }, {});
    }

    const where = setFiltersAndSearch(
      filters,
      filtersObj,
      searchString,
      searchStringField,
      searchDate,
      searchDateField,
      searchNumber,
      searchNumberField
    );
    const skip = countSkip(page, take);
    const count = await table.aggregate({
      where,
      _count: { id: true }
    });

    const countResult = count._count.id;
    // if (countResult < 1) throw new NotFoundException('No Data');

    const result = await table.findMany({
      ...object,
      where,
      skip,
      orderBy: newOrderBy ?? orderBy
    });
    const totalPage = countResult < take ? 1 : Math.ceil(countResult / take);

    return {
      count: result.length,
      countAll: count._count.id,
      totalPage,
      result
    };
  }
}
