import readXlsxFile from 'read-excel-file/node';
import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

const prisma = new PrismaClient();

interface province {
  id: string;
  name: string;
}
const provinces: province[] = [];

interface city {
  id: string;
  name: string;
  provinceId: string;
}
const cities: city[] = [];

interface district {
  id: string;
  name: string;
  provinceId: string;
  cityId: string;
}
const districts: district[] = [];

interface village {
  id: string;
  name: string;
  provinceId: string;
  cityId: string;
  districtId: string;
}
const villages: village[] = [];

readXlsxFile('prisma/kemendagri-2023.xlsx')
  .then((rows) => {
    rows.map((row) => {
      if (row[0] === 1) {
        provinces.push({
          id: row[1].toString(),
          name: row[2].toString(),
        });
      }
    });

    return rows;
  })
  .then((rows) => {
    rows.map((row) => {
      if (row[0] === 2) {
        const parent = row[5].toString().split(' - ');

        cities.push({
          id: row[1].toString(),
          name: row[2].toString(),
          provinceId: parent[0],
        });
      }
    });

    return rows;
  })
  .then((rows) => {
    rows.map((row) => {
      if (row[0] === 3) {
        const parent = row[5].toString().split(' - ');
        const parentId = parent[0];

        const city = cities.filter((city) => city.id === parentId)[0];

        districts.push({
          id: row[1].toString(),
          name: row[2].toString(),
          provinceId: city.provinceId,
          cityId: parentId,
        });
      }
    });

    return rows;
  })
  .then((rows) => {
    rows.map((row) => {
      if (row[0] === 4) {
        const parent = row[5].toString().split(' - ');
        const parentId = parent[0];

        const district = districts.filter(
          (district) => district.id === parentId,
        )[0];

        villages.push({
          id: row[1].toString(),
          name: row[2].toString(),
          provinceId: district.provinceId,
          cityId: district.cityId,
          districtId: parentId,
        });
      }
    });

    return rows;
  })
  .then(async () => {
    try {
      await prisma.province.createMany({ data: provinces });
      Logger.log('Provinces Seed Succeed');

      await prisma.city.createMany({ data: cities });
      Logger.log('Cities Seed Succeed');

      await prisma.district.createMany({ data: districts });
      Logger.log('Districts Seed Succeed');

      await prisma.village.createMany({ data: villages });
      Logger.log('Villages Seed Succeed');
      Logger.log('Dial Codes Seed Succeed');
    } catch (e) {
      console.log(e);
    }
  })
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
