import { ReactNode } from "react";
import { AppLayout } from "@/components/layout/AppLayout";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function LegalLayout({ title, subtitle, children }: Props) {
  return (
    <AppLayout>
      <article className="mx-auto max-w-3xl">
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </header>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-5 text-[15px] leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_a]:text-primary [&_a]:underline [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:p-2 [&_th]:border [&_th]:border-border [&_td]:p-2 [&_td]:border [&_td]:border-border">
          {children}
        </div>
      </article>
    </AppLayout>
  );
}
