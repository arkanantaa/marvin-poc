import { contact } from "../data/portfolio";

export function ContactPanel() {
  return (
    <>
      <div className="contact-copy">
        <p className="eyebrow">LET’S MAKE A MEMORY</p>
        <h2>{contact.heading}</h2>
        <p>{contact.description}</p>
        {contact.action ? (
          <a className="contact-action" href={contact.action.href}>
            {contact.action.label}<span aria-hidden="true">↗</span>
          </a>
        ) : <p className="contact-note">{contact.note}</p>}
      </div>
      <div className="memory-stamp" aria-hidden="true">
        <span>MADE FOR</span><b>good<br />company.</b><span>MARVIN STUDIO ✳</span>
      </div>
    </>
  );
}
