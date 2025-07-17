"use client";

import { SettingsBubble } from "@/components/devui/settingsbubble/SettingsBubble";

const layout = ({children} : {children:React.ReactNode}) => {

  return (
    <>
      {children}
      <SettingsBubble />
    </>
  );
};

export default layout;
