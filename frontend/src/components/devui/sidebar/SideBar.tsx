"use client";

import React, { useEffect, useState } from "react";
import { TelEstateLogo } from "../Logo";
import { Sidebar, SidebarBody, SidebarLink } from "../../ui/sidebar";
import { cn } from "@/lib/utils";
import { bottomLinks, mainLinksLandlord, mainLinksTenant, mainLinksTradeperson  } from "./links";
import { useUserRole } from "@/hooks/useUserRole";


export function SideBar() {
  const { role, loading } = useUserRole();
  const [open, setOpen] = useState(false);

  const getLinks = () => {
    if (role === "tenant") return mainLinksTenant;
    if (role === "manager") return mainLinksLandlord;
    if (role === "tradeperson") return mainLinksTradeperson;
    return [];
  };
  if (loading) return null; 




  return (
    <div
      className={cn(
        "flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          {/* Top section */}
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <TelEstateLogo />
            <div className="mt-8 flex flex-col gap-2">
              {(getLinks()).map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col gap-2">
            {bottomLinks.map((link, idx) => (
              <SidebarLink key={`bottom-${idx}`} link={link} />
            ))}

            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
