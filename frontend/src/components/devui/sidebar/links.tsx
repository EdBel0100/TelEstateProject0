import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconMessageCircle,
  IconCreditCard,
  IconChartBar,
  IconTicket,
  IconBuilding
} from "@tabler/icons-react";
import { signOut } from "@/utils/userUtils";

export const mainLinksLandlord = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Manage Tickets",
      href: "/managetickets",
      icon: <IconTicket className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Manage Buidings",
      href: "/managebuildings",
      icon: <IconBuilding className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Manage Messages",
      href: "/managemessages",
      icon: <IconMessageCircle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Rent Analysis",
      href: "analysisrent",
      icon: <IconChartBar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Manage Payments",
      href: "managepayments",
      icon: <IconCreditCard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    // {
    //   label: "Manage Contacts",
    //   href: "#",
    //   icon: <IconCreditCard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    // },
   
  ];

  export const mainLinksTenant = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Payments",
      href: "/payments",
      icon: <IconCreditCard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Messaging",
      href: "/messages",
      icon: <IconMessageCircle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Tickets",
      href: "/tickets",
      icon: <IconTicket className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  export const mainLinksTradeperson = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Payments",
      href: "/tenantPayments",
      icon: <IconCreditCard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Messaging",
      href: "/tenantsmessaging",
      icon: <IconMessageCircle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Tickets",
      href: "/tenantstickets",
      icon: <IconMessageCircle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  export const bottomLinks = [
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Logout",
      href: "/",
      icon: <IconArrowLeft onClick={signOut} className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];