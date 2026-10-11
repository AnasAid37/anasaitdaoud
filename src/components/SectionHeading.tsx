export default function SectionHeading({ eyebrow, title, introduction, index, id }: { eyebrow: string; title: string; introduction?: string; index?: string; id?: string }) {
  return <div className="section-heading">
    <div className="section-heading__top"><span className="eyebrow"><span className="eyebrow-line" /> {eyebrow}</span>{index && <span className="section-index">/ {index}</span>}</div>
    <div className="section-heading__body"><h2 id={id}>{title}</h2>{introduction && <p>{introduction}</p>}</div>
  </div>
}
