import { useParams, Navigate, Link } from 'react-router-dom';
import { ChevronRight, Mountain } from 'lucide-react';
import { caiPages } from '@/lib/cai-pages-data';

const CaiInfoPage = () => {
  const { slug } = useParams<{ slug: string }>();
  // Try direct match, otherwise look for matching slug field
  const page = slug
    ? caiPages[slug] ||
      Object.values(caiPages).find((p) => p.slug === slug)
    : undefined;

  if (!page) return <Navigate to="/404" replace />;

  return (
    <article className="container-page py-10 max-w-3xl">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        {page.breadcrumb && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span>{page.breadcrumb}</span>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{page.title}</span>
      </nav>

      <header className="flex items-start gap-3 mb-6 pb-6 border-b border-border">
        <Mountain className="h-8 w-8 text-primary shrink-0 mt-1" />
        <div>
          <h1 className="heading-section">{page.title}</h1>
          {page.intro && (
            <p className="text-body text-muted-foreground mt-2">{page.intro}</p>
          )}
        </div>
      </header>

      <div className="space-y-5">
        {page.blocks.map((block, i) => {
          if (block.type === 'heading') {
            return (
              <h2
                key={i}
                className="font-heading text-xl text-foreground mt-6 first:mt-0"
              >
                {block.text}
              </h2>
            );
          }
          if (block.type === 'paragraph') {
            return (
              <p key={i} className="text-body text-foreground/85 leading-relaxed">
                {block.text}
              </p>
            );
          }
          if (block.type === 'list') {
            return (
              <ul key={i} className="space-y-2 list-disc list-outside pl-5 text-foreground/85">
                {block.items.map((item, j) => (
                  <li key={j} className="text-body leading-relaxed">{item}</li>
                ))}
              </ul>
            );
          }
          if (block.type === 'link') {
            return (
              <a
                key={i}
                href={block.href}
                target={block.external === false ? undefined : '_blank'}
                rel={block.external === false ? undefined : 'noopener noreferrer'}
                className="inline-flex items-center gap-2 text-primary hover:underline text-body break-all"
              >
                {block.label}
              </a>
            );
          }

          return null;
        })}
      </div>
    </article>
  );
};

export default CaiInfoPage;
