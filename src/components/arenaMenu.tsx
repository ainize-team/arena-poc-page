"use client";

import { Menu, MenuProps } from 'antd';
import { useRouter } from "next/navigation";

type ArenaMenuProps = {
  page: string,
}

export default function ArenaMenu({ page }: ArenaMenuProps) {
  const router = useRouter();
  const items = [{
    key: "battle",
    label: "Battle",
  }, {
    key: "dashboard",
    label: "Dashboard",
  }]

  const onClickMenu: MenuProps["onClick"] = (e: any) => {
    router.push(`/${e.key !== "battle" ? e.key : ""}`);
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
