interface MaterialInfoProps {
  title: string;
  E: number;
  sigma: number;
}

export const MaterialInfo = ({ title, E, sigma }: MaterialInfoProps) => (
  <div className="data-card">
    <h3 className="text-sm font-medium text-foreground mb-3">{title}</h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-xs text-muted-foreground">Young's Modulus (E)</span>
        <span className="font-mono text-sm text-foreground">{E.toLocaleString()} MPa</span>
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-muted-foreground">Ultimate Strength (σ<sub>u</sub>)</span>
        <span className="font-mono text-sm text-foreground">{sigma} MPa</span>
      </div>
    </div>
  </div>
);
