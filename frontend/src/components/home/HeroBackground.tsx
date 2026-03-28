const HeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-[radial-gradient(ellipse_at_top,_#e63946_0%,_transparent_65%)] opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_top,_#f4a261_0%,_transparent_70%)] opacity-[0.06]" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#e63946]/5 to-transparent" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_left,_#1a0a0a_0%,_transparent_70%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_#1a0a0a_0%,_transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-[#e63946]/20 via-transparent to-transparent -translate-x-32 rotate-12 origin-top" />
      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-[#e63946]/15 via-transparent to-transparent translate-x-32 -rotate-12 origin-top" />
    </div>
  );
};

export default HeroBackground;
