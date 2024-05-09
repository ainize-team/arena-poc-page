"use client";

import { ArenaMenuKeys } from '@/type';
import { Menu, MenuProps } from 'antd';
import { useRouter } from "next/navigation";

type ArenaMenuProps = {
  page: string,
}

export default function ArenaMenu({ page }: ArenaMenuProps) {
  const router = useRouter();
  const items = [{
    key: ArenaMenuKeys.BATTLE,
    label: "Battle",
  }, {
    key: ArenaMenuKeys.DASHBOARD,
    label: "Dashboard",
  }]

  const onClickMenu: MenuProps["onClick"] = (e: any) => {
    router.push(`/${e.key !== ArenaMenuKeys.BATTLE ? e.key : ""}`);
  }

  return (
    <Menu
      mode="horizontal"
      defaultSelectedKeys={[page]}
      items={items}
      style={{ flex: 1, minWidth: 0 }}
      onClick={onClickMenu}
    />
  );
}
