'use client';

import ToolbarGroup from "@/components/ui/toolbar/ToolbarGroup";

export default function EventLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ToolbarGroup />
      {children}
    </>
  );
}
