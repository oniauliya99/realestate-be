import { AppForCustomAkses } from './type';

export const toListString = (obj: AppForCustomAkses[]) => {
  const appsUids: string[] = [];
  const akses: string[] = [];
  obj.forEach(({ uid, nama, menus }) => {
    let appsGranted = false;
    menus.forEach(({ nama: menuName, actions }) => {
      actions.forEach((action) => {
        if (!action.isGranted) return;
        appsGranted = true;
        akses.push(`${uid}_${menuName}_${action.nama}`);
      });
    });
    if (appsGranted) appsUids.push(uid);
  });
  return { appsUids, akses };
};
