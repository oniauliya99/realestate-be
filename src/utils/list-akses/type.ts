type Action = {
  nama: string;
  isGranted: boolean;
};

type Menu = {
  nama: string;
  actions: Action[];
};

export type AppForCustomAkses = {
  uid: string;
  nama: string;
  menus: Menu[];
};
