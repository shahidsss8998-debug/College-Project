const SectionTitle = ({ title, subtitle, center = false }) => {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      {subtitle && (
        <p className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-2">
          {subtitle}
        </p>
      )}
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-secondary mb-4 leading-tight">
        {title}
      </h2>
      <div className={`h-1 w-16 bg-accent rounded-full ${center ? 'mx-auto' : ''}`}></div>
    </div>
  );
};

export default SectionTitle;
