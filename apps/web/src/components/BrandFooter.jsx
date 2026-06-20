import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

export default function BrandFooter() {
  return (
    <footer className="mt-8 pt-10">
      <Separator />
      <div className="mx-auto flex max-w-[1100px] flex-wrap justify-between gap-8 px-6 py-10">
        <div>
          <div className="font-display font-bold text-text-bright">
            cortxt<span className="text-primary">.</span>
          </div>
          <p className="cx-muted mt-2 max-w-[320px] text-sm">
            Plattform för beslut & lärande med AI och strukturerade modeller.
          </p>
        </div>
        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-1.5">
            <strong className="text-text-bright">Cortxt</strong>
            <Link to="/academy" className="text-muted-foreground hover:text-foreground">Kurser</Link>
            <Link to="/metod" className="text-muted-foreground hover:text-foreground">Metod</Link>
            <a href="https://app.cortxt.io" className="text-muted-foreground hover:text-foreground">App</a>
          </div>
          <div className="flex flex-col gap-1.5">
            <strong className="text-text-bright">Vertikaler</strong>
            <a href="https://juvahem.se" className="text-muted-foreground hover:text-foreground">Juvahem</a>
            <a href="https://orgkomp.com" className="text-muted-foreground hover:text-foreground">Orgkomp</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
