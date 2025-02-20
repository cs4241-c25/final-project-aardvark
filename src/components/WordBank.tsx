import React from "react";

export default function WordBank({ children }: { children: React.ReactNode }) {
  const childArray = React.Children.toArray(children);

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2">
      {childArray.map((child, index) => (
        <div key={index} className="relative flex items-center justify-center w-full h-8 md:h-12 border-2 dark:border-none dark:bg-inset rounded-md">
          {child}
        </div>
      ))}
    </div>
  );
};