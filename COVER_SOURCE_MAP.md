# November 2026 cover ZIP — source-to-website mapping

The supplied `covers.zip` includes front covers, obsolete/alternative cover iterations, printable interiors, PDFs and inconsistent language folder names. Only **18 final front-cover PNGs** were needed for this website update. Every selected file was visually checked for the **language printed on the front** and the **1–3 age badge** before it was imported.

| Original archive location | Website product ID | Selected cover set | Languages |
| --- | --- | --- | --- |
| `La Granja/PortadaIII/` | `farm` | `PortadaIII` (newest Farm set) | EN, DE, ES (`CAST`), FR, IT, CA (`CAT`) |
| `Halloween 26/PotradaII/` | `halloween` | `PotradaII` (newer Halloween set) | EN, DE, ES (`Cast`), FR, IT, CA (`Cat`) |
| `Vehicles/Portada/` | `cars` | All six Vehicles front covers | EN (`Angles`), DE (`Alemany`), ES (`Castella`), FR (`Frances`), IT (`Italia`), CA (`Catala`) |

**Why these sets?** The ZIP contains `Halloween 26/PortadaI/` as an alternative with some back-cover assets, plus `Halloween 26/PotradaII/` with six matching full front covers. We selected the latter. The Farm folder is explicitly `PortadaIII`. The Vehicles set contains one language-specific front cover for every supported locale. **Christmas artwork was not included** and was preserved unchanged.

## Clean mapping

Each selected front cover was renamed into one consistent import path, regardless of the original filename:

```text
replacement-images/
└── covers/
    ├── farm/
    │   ├── en.png
    │   ├── de.png
    │   ├── es.png
    │   ├── fr.png
    │   ├── it.png
    │   └── ca.png
    ├── halloween/
    │   ├── en.png
    │   ├── de.png
    │   ├── es.png
    │   ├── fr.png
    │   ├── it.png
    │   └── ca.png
    └── cars/
        ├── en.png
        ├── de.png
        ├── es.png
        ├── fr.png
        ├── it.png
        └── ca.png
```

The importer optimizes each image to the generated output convention:

`site/assets/covers/<product-id>/<language>.webp`

For example:

| ZIP entry (original filename) | Final website file |
| --- | --- |
| `Vehicles/Portada/Angles/Vehicles divertits_ llibre per pintar.png` | `site/assets/covers/cars/en.webp` |
| `Vehicles/Portada/Castella/Vehicles para colorear en la carretera.png` | `site/assets/covers/cars/es.webp` |
| `La Granja/PortadaIII/DE/Imagenes/Libro da colorare_ La fattoria alpina.png` | `site/assets/covers/farm/de.webp` |
| `Halloween 26/PotradaII/En/Imagenes/PortadaHalloween.png` | `site/assets/covers/halloween/en.webp` |

Filenames alone can be misleading: the English Vehicles filename uses Catalan words, and the German Farm filename uses Italian words, but the images themselves visibly show English and German text respectively. Mapping was made from the **folder language + visible printed cover**, not the raw filename.

The PDFs, interior pages, alternative Halloween covers and the unmodified Christmas covers are not included in the published image assets. There is no runtime dependency on the source ZIP or a separate mapping file. Future cover updates use the same `replacement-images/covers/<id>/<locale>.png` workflow in `PRODUCT_UPDATE_GUIDE.md`.

**Catalog change:** `cars` is the stable technical ID while the actual covers say **Vehicles**, so website product titles use the translated word “Vehicles.” All six covers exist. There are Amazon links for EN, DE, FR, IT and CA; ES intentionally shows **Coming soon** until its own Amazon URL is supplied.
