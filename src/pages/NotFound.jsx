import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6 px-6 pt-24">
      <span className="eyebrow text-gold">Erreur 404</span>
      <h1 className="text-5xl md:text-7xl">Page introuvable</h1>
      <p className="text-noir/60 max-w-md">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Button to="/">Retour à l'accueil</Button>
    </div>
  );
}
