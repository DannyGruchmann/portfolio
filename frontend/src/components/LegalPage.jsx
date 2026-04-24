import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BrandLogo from "./BrandLogo";

const legalData = {
  name: "Danny Gruchmann",
  brand: "DGLabs",
  email: "kontakt@dannygruchmann.com",
  website: "dannygruchmann.com",
  address: "[Bitte ladungsfähige Anschrift eintragen]",
  phone: "[Bitte Telefonnummer eintragen oder bestätigen, dass keine Telefonnummer veröffentlicht werden soll]",
  vatId: "[Falls vorhanden: USt-IdNr. / sonst entfernen]",
  taxNumber: "[Steuernummer wird nicht öffentlich benötigt und sollte normalerweise nicht veröffentlicht werden]",
  supervisoryAuthority: "[Falls für deine Tätigkeit erforderlich: zuständige Aufsichtsbehörde]",
};

const Section = ({ title, children }) => (
  <section className="legal-section">
    <h2>{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
);

const LegalShell = ({ title, eyebrow, children }) => (
  <div className="App min-h-screen">
    <main className="relative overflow-hidden pt-[96px] pb-20">
      <div className="absolute inset-0 bg-grid opacity-[0.18]" />
      <div className="orb w-[420px] h-[420px] bg-[#1e73c8] -top-36 -right-24 opacity-30" />
      <div className="container-x relative z-10">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="inline-flex items-center gap-3 text-[#c7d0de] hover:text-white">
            <BrandLogo size="sm" alt="DGLabs logo" />
            <span className="font-semibold tracking-tight">DGLabs</span>
          </Link>
          <Link to="/" className="btn-ghost !py-2.5 !px-4 !text-[13.5px]">
            <ArrowLeft size={15} />
            Zur Startseite
          </Link>
        </div>

        <div className="max-w-[860px]">
          <div className="eyebrow mb-5">{eyebrow}</div>
          <h1 className="text-[clamp(38px,6vw,76px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-white">
            {title}
          </h1>
          <p className="mt-6 max-w-[680px] text-[16px] leading-[1.7] text-[#a8b2c3]">
            Stand: April 2026. Diese Seite ist technisch vorbereitet. Die markierten Angaben müssen vor
            Veröffentlichung mit deinen echten Daten ersetzt werden.
          </p>
        </div>

        <article className="legal-card mt-12">{children}</article>
      </div>
    </main>
  </div>
);

export const ImprintPage = () => (
  <LegalShell title="Impressum" eyebrow="Anbieterkennzeichnung">
    <Section title="Angaben gemäß § 5 DDG">
      <p>
        {legalData.name}
        <br />
        {legalData.brand}
        <br />
        {legalData.address}
      </p>
    </Section>

    <Section title="Kontakt">
      <p>
        E-Mail: <a href={`mailto:${legalData.email}`}>{legalData.email}</a>
        <br />
        Telefon: {legalData.phone}
      </p>
    </Section>

    <Section title="Umsatzsteuer">
      <p>{legalData.vatId}</p>
    </Section>

    <Section title="Aufsichtsbehoerde">
      <p>{legalData.supervisoryAuthority}</p>
    </Section>

    <Section title="Verantwortlich für den Inhalt">
      <p>
        {legalData.name}
        <br />
        {legalData.address}
      </p>
    </Section>

    <Section title="Verbraucherstreitbeilegung">
      <p>
        Ich bin nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>
    </Section>
  </LegalShell>
);

export const PrivacyPage = () => (
  <LegalShell title="Datenschutzerklärung" eyebrow="Datenschutz">
    <Section title="1. Verantwortlicher">
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website ist:
        <br />
        {legalData.name}, {legalData.brand}
        <br />
        {legalData.address}
        <br />
        E-Mail: <a href={`mailto:${legalData.email}`}>{legalData.email}</a>
      </p>
    </Section>

    <Section title="2. Hosting und technische Bereitstellung">
      <p>
        Diese Website wird als statische Webanwendung bereitgestellt. Beim Aufruf der Website werden technisch
        notwendige Zugriffsdaten verarbeitet, etwa IP-Adresse, Datum und Uhrzeit des Abrufs, Browsertyp,
        Betriebssystem und angefragte Dateien. Diese Verarbeitung ist erforderlich, um die Website sicher und
        stabil auszuliefern.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt in der sicheren,
        performanten und fehlerfreien Bereitstellung der Website.
      </p>
    </Section>

    <Section title="3. Kontaktformular und Projektanfragen">
      <p>
        Wenn du das Kontaktformular nutzt, werden die von dir eingegebenen Daten verarbeitet: Name, E-Mail,
        Telefonnummer, Unternehmen, Branche, Ziel, Startzeitpunkt, Budget und Nachricht. Die Daten werden genutzt, um deine
        Anfrage zu beantworten, das passende Angebot einzuschätzen und eine mögliche Zusammenarbeit
        vorzubereiten.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage auf vorvertragliche Massnahmen
        gerichtet ist, sowie Art. 6 Abs. 1 lit. f DSGVO für die strukturierte Bearbeitung eingehender
        Anfragen.
      </p>
    </Section>

    <Section title="4. E-Mail-Versand und CRM/Webhook">
      <p>
        Formularanfragen können über einen E-Mail-Dienst an mich weitergeleitet werden. Zusätzlich ist eine
        Webhook-Schnittstelle vorbereitet, über die Anfrageinformationen an ein CRM- oder Automationstool
        übergeben werden können, sobald ein entsprechendes System aktiv verbunden ist.
      </p>
      <p>
        Vor Live-Schaltung muss hier konkret ergänzt werden, welche Anbieter tatsächlich eingesetzt werden,
        zum Beispiel Resend, n8n, Zapier, Make, Airtable, HubSpot oder ein anderes CRM.
      </p>
    </Section>

    <Section title="5. Spracheinstellung">
      <p>
        Die Website speichert deine Sprachwahl lokal in deinem Browser. Diese Speicherung erfolgt in
        `localStorage` und wird nicht an einen Server übertragen. Du kannst diese Daten jederzeit über die
        Browser-Einstellungen löschen.
      </p>
    </Section>

    <Section title="6. Analyse und Tracking">
      <p>
        Auf dieser Website ist aktuell kein Analytics- oder Session-Recording-Tracking aktiv eingebunden.
      </p>
    </Section>

    <Section title="7. Schriftarten und externe Ressourcen">
      <p>
        Die Website kann externe Schriftarten von Google Fonts laden. Dabei kann deine IP-Adresse an Google
        übermittelt werden. Falls die Website später vollständig ohne externe Schriftquellen betrieben wird,
        sollte dieser Abschnitt entsprechend entfernt oder angepasst werden.
      </p>
    </Section>

    <Section title="8. Speicherdauer">
      <p>
        Anfragen werden nur so lange gespeichert, wie es für die Bearbeitung, Angebotserstellung,
        Nachverfolgung oder gesetzliche Aufbewahrungspflichten erforderlich ist.
      </p>
    </Section>

    <Section title="9. Deine Rechte">
      <p>
        Du hast nach Maßgabe der DSGVO Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der
        Verarbeitung, Datenübertragbarkeit und Widerspruch. Zudem hast du das Recht, dich bei einer
        Datenschutzaufsichtsbehörde zu beschweren.
      </p>
    </Section>

    <Section title="10. Pflicht zur Bereitstellung">
      <p>
        Die Bereitstellung deiner Daten im Kontaktformular ist freiwillig. Ohne die erforderlichen Angaben kann
        ich deine Anfrage jedoch nicht sinnvoll bearbeiten.
      </p>
    </Section>
  </LegalShell>
);
