import { type PropsWithChildren } from "react";

export const PageLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="h-full w-full overflow-y-auto border-x border-slate-400 md:max-w-2xl">
        {children}
      </div>
    </main>
  );
};
