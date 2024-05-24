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
  }, {
    key: ArenaMenuKey.ABOUT,
    label: "About",
  }]

  const onClickMenu: MenuProps["onClick"] = (e: any) => {
    router.push(`/${e.key !== ArenaMenuKey.ARENA ? e.key : ""}`);
  }

  return (
    <div style={{background: "#ffffff"}}>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={[page]}
        items={items}
        style={{ flex: 1, minWidth: 0, paddingInline: 40,}}
        onClick={onClickMenu}
      />
    </div>
  );
}
