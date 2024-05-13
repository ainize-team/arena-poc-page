"use client";

import { ArenaMenuKey } from '@/type';
import { Menu, MenuProps } from 'antd';
import { useRouter } from "next/navigation";

type ArenaMenuProps = {
  page: string,
}

export default function ArenaMenu({ page }: ArenaMenuProps) {
  const router = useRouter();
  const items = [{
    key: ArenaMenuKey.ARENA,
    label: "Arena",
  }, {
    key: ArenaMenuKey.LEADERBOARD,
    label: "Leaderboard",
  }]

  const onClickMenu: MenuProps["onClick"] = (e: any) => {
    router.push(`/${e.key !== ArenaMenuKey.ARENA ? e.key : ""}`);
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
