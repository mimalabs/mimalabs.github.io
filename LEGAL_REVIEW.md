# MIMA LABS V12 — legal/privacy implementation notes

This is an engineering checklist and starter copy, not a substitute for legal advice. The final wording depends on the actual legal owner, domain, Amazon seller relationship, markets and analytics setup.

## Switzerland

The Swiss FDPIC says Swiss companies should provide a transparent, understandable privacy statement explaining what personal data is collected, why, and whether it is shared with third parties. For a multilingual website, the privacy statement should also be available in those languages.

Source: https://www.edoeb.admin.ch/en/privacy-statements-on-the-internet

SECO states that providers offering goods/services in electronic commerce must disclose clear identity, contact address and valid email. MIMA LABS V1 does not take orders on-site, but the footer/legal page still exposes operator/contact information and clearly explains that the transaction happens on Amazon.

Sources:
- https://www.seco.admin.ch/de/onlinehandel
- https://www.kmu.admin.ch/en/statutory-obligations-swiss-and-european-e-commerce-laws

## EU / EEA visitors

Where GDPR applies, privacy information should identify the controller and explain purposes, data categories, legal basis, retention, recipients/transfers and user rights in a concise, transparent form. This V1 provides a localized privacy page and intentionally minimizes processing.

Source: https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en

EU guidance says non-essential tracking/analytics cookies or similar device-storage technologies can require consent before activation. V12 therefore keeps optional analytics blocked until the visitor selects Accept; Reject leaves optional analytics disabled. The choice can be reopened from the footer.

Source: https://europa.eu/youreurope/business/growing/digitalising/online-privacy/index_en.htm

## United States / children

COPPA can apply to websites directed to children under 13 that collect personal information, and the FTC considers subject matter and visual presentation among the factors for deciding whether a service is child-directed. Do not rely only on a sentence saying the site is "for parents".

Source: https://www.ftc.gov/business-guidance/resources/childrens-online-privacy-protection-rule-six-step-compliance-plan-your-business

FTC guidance recognizes website analytics used solely to support internal operations as a potential exception for persistent identifiers, provided the information is not used for other purposes such as behavioral advertising or profiling. The COPPA Rule was amended in 2025, so confirm the final production analytics configuration against current requirements before launch.

Sources:
- https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- https://www.ftc.gov/legal-library/browse/federal-register-notices/16-cfr-part-312-coppa-final-rule-amendments

## Plausible

Plausible states that its current hosted analytics product is cookieless, does not use persistent identifiers for cross-site/cross-device tracking, stores aggregate analytics and processes/stores visitor analytics in the EU. V1 does not activate it until a real site-specific script URL is configured.

Source: https://plausible.io/data-policy

## Design choices made because the products are for children

- No user accounts.
- No contact form or newsletter in V1.
- No comments or user-generated content.
- No advertising pixels.
- No personalized/behavioral advertising.
- No direct collection of child names, email, photos, voice, precise location or similar data.
- Testimonials are self-hosted-video-ready instead of embedding YouTube by default.
- Demo testimonials are automatically hidden in production.

## Amazon

MIMA LABS V1 is a showcase/referral site. It states that availability, final price, taxes, payment, delivery, returns and the final sales contract are handled on the relevant Amazon marketplace and/or by the seller shown there.

If MIMA LABS later participates in Amazon Associates or receives a commission for referrals, enable and localize an appropriate affiliate disclosure before publishing affiliate links.

## V11 cookie-consent behavior

V11 uses a conservative implementation: the compact privacy banner is enabled by default and optional analytics is actually gated behind the user's choice. The preference is stored locally so the banner is not repeated on every visit. If the user rejects, optional analytics stays off; if the user accepts, the configured Plausible script may load. Re-check the requirements for the markets served before launch and after any tracking or embedded-media change.
