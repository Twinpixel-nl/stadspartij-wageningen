// scripts/generator.js

// === STAP 1: IMPORTS ===
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");


// === STAP 2: PADEN DEFINIEREN ===
const baseDir = path.join(__dirname, ".."); // Root map van het project

// --- Input (Bronbestanden) ---
const sourceDir = path.join(baseDir, "src");
const blogsContentDir = path.join(sourceDir, "_content", "blogs");
const raadsledenContentDir = path.join(sourceDir, "_content", "raadsleden");
const staticAssetsDir = sourceDir;
const netlifyCmsDir = path.join(baseDir, "admin"); // De map met admin/index.html en admin/config.yml

// --- Output (Gegenereerde website) ---
const outputDir = path.join(baseDir, "public");
const blogsOutputDir = path.join(outputDir, "blogs");
const raadsledenOutputDir = path.join(outputDir, "raadsleden");
const dataOutputDir = path.join(outputDir, "data");

// === STAP 3: HULPFUNCTIES ===

/**
 * Zorgt ervoor dat een map bestaat. Maakt deze aan als hij niet bestaat.
 * @param {string} dirPath Het pad naar de map.
 */
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Map aangemaakt: ${path.relative(baseDir, dirPath)}`);
  }
}

/**
 * Creëert de volledige HTML voor een blogpagina.
 * @param {object} data - Frontmatter data.
 * @param {string} htmlContent - HTML-inhoud uit markdown.
 * @returns {string} - Volledige HTML-pagina.
 */
/**
 * Creëert de volledige HTML voor een blogpagina.
 * @param {object} data - Frontmatter data.
 * @param {string} markdownContent - De RUWE markdown content.
 * @param {function} marked - De 'marked' parse functie.
 * @returns {string} - Volledige HTML-pagina.
 */
function createBlogHtmlPage(data, markdownContent, marked) {
  const formattedDate = new Date(data.date).toLocaleDateString("nl-NL", {
    year: "numeric", month: "long", day: "numeric",
  });
  
  // De markdown wordt HIER omgezet naar HTML.
  const htmlContent = marked.parse(markdownContent);

  // !! LAYOUT TEMPLATE VOOR BLOG PAGINA !!
  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.title || "Blog"} - Stadspartij Wageningen</title>
  <meta name="description" content="${data.excerpt || data.title}" />
  
  <!-- Favicon -->
  <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x16.png">
  <link rel="manifest" href="/images/favicon/site.webmanifest">

  <!-- Fonts & Styles -->
  <link rel="stylesheet" href="/css/style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Lato:wght@400;700&display=swap" rel="stylesheet" />

  <!-- Open Graph (Facebook, LinkedIn) -->
  <meta property="og:title" content="${data.title}" />
  <meta property="og:description" content="${data.excerpt || data.title}" />
  <meta property="og:image" content="${data.thumbnail || 'https://stadspartijwageningen.nl/images/logo.png'}" />
  <meta property="og:url" content="https://stadspartijwageningen.nl${data.path || ''}" />
  <meta property="og:type" content="article" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${data.title}" />
  <meta name="twitter:description" content="${data.excerpt || data.title}" />
  <meta name="twitter:image" content="${data.thumbnail || 'https://stadspartijwageningen.nl/images/logo.png'}" />

  <!-- Structured Data (Schema.org) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${data.title}",
    "description": "${data.excerpt || data.title}",
    "image": "${data.thumbnail || 'https://stadspartijwageningen.nl/images/logo.png'}",
    "author": {
      "@type": "Organization",
      "name": "Stadspartij Wageningen"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Stadspartij Wageningen",
      "logo": {
        "@type": "ImageObject",
        "url": "https://stadspartijwageningen.nl/images/logo.png"
      }
    },
    "datePublished": "${formattedDate}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://stadspartijwageningen.nl${data.path || ''}"
    }
  }
  </script>
</head>
<body>
  <header class="site-header">
    <div class="container">
      <div class="logo">
        <a href="/index.html"><img src="/images/logo.png" alt="Logo Stadspartij Wageningen" /></a>
      </div>
      <nav class="main-nav">
        <ul>
          <li><a href="/index.html">Home</a></li>
          <li><a href="/nieuws.html" class="active">Nieuws</a></li>
          <li class="dropdown">
            <a href="#" class="drop-btn">Verkiezingen</a>
            <div class="dropdown-content">
              <a href="/samenvatting-verkiezingsprogramma.html">Samenvatting Programma</a>
              <a href="/verkiezingsprogramma-compleet.html">Volledig Programma</a>
              <a href="/kieslijst.html">Kieslijst</a>
              <a href="/stellingen-stemwijzer.html">Stellingen Stemwijzer</a>
              <a href="/stellingen-mijnstem.html">Stellingen MijnStem</a>
            </div>
          </li>
          <li><a href="/fractie.html">Fractie</a></li>
          <li><a href="/contact.html">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

<main class="container section-padding">
  <article class="blog-post">
    <h1>${data.title}</h1>

    ${data.thumbnail ? `
    <div class="blog-post-header">
      <a href="${data.path || ''}">
  <img src="${data.thumbnail}" alt="${data.title}" class="blog-post-thumbnail" />
</a>
      <div class="blog-post-info">
        <p class="meta">Gepubliceerd op ${formattedDate}</p>
        <div class="blog-post-content">${htmlContent}</div>
      </div>
    </div>
    ` : `
      <p class="meta">Gepubliceerd op ${formattedDate}</p>
      <div class="blog-post-content">${htmlContent}</div>
    `}

    <a href="/nieuws.html" class="btn btn-light">← Terug naar overzicht</a>
  </article>
</main>




  <footer class="site-footer">
    <div class="container text-center">
      <p>© 2025 Stadspartij Wageningen – Lokaal en Betrokken</p>
      <p>Website door <strong><a href="https://twinpixel.nl" target="_blank" rel="noopener noreferrer">TwinPixel</a></strong></p>
    </div>
  </footer>

  <script src="/js/main.js"></script>
</body>
</html>`;
}

/**
 * Creëert de volledige HTML voor een raadslidpagina.
 * @param {object} data - Frontmatter data.
 * @param {string} markdownBioContent - De RUWE markdown biografie.
 * @param {function} marked - De 'marked' parse functie.
 * @returns {string} - Volledige HTML-pagina.
 */
function createRaadslidHtmlPage(data, markdownBioContent, marked) {
  const htmlBioContent = marked.parse(markdownBioContent);

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.naam} – ${data.rol} | Stadspartij Wageningen</title>
  <meta name="description" content="Profiel van ${data.naam}, ${data.rol} bij Stadspartij Wageningen." />

  <!-- Favicon -->
  <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x16.png">
  <link rel="manifest" href="/images/favicon/site.webmanifest">

  <!-- Fonts & Styles -->
  <link rel="stylesheet" href="/css/style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Lato:wght@400;700&display=swap" rel="stylesheet" />

  <!-- Open Graph -->
  <meta property="og:title" content="${data.naam} – ${data.rol}" />
  <meta property="og:description" content="Profiel van ${data.naam}, ${data.rol}" />
  <meta property="og:image" content="${data.foto || '/images/logo.png'}" />
  <meta property="og:url" content="https://stadspartijwageningen.nl${data.pad || ''}" />
  <meta property="og:type" content="profile" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${data.naam} – ${data.rol}" />
  <meta name="twitter:description" content="Profiel van ${data.naam}, ${data.rol}" />
  <meta name="twitter:image" content="${data.foto || '/images/logo.png'}" />

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "${data.naam}",
    "description": "${data.rol}",
    "image": "${data.foto || 'https://stadspartijwageningen.nl/images/logo.png'}",
    "jobTitle": "${data.rol}",
    "affiliation": {
      "@type": "Organization",
      "name": "Stadspartij Wageningen"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://stadspartijwageningen.nl${data.pad || ''}"
    }
  }
  </script>
</head>
<body>
  <header class="site-header">
    <div class="container">
      <div class="logo">
        <a href="/index.html"><img src="/images/logo.png" alt="Logo Stadspartij Wageningen" /></a>
      </div>
      <nav class="main-nav">
        <ul>
          <li><a href="/index.html">Home</a></li>
          <li><a href="/nieuws.html">Nieuws</a></li>
          <li class="dropdown">
            <a href="#" class="drop-btn">Verkiezingen</a>
            <div class="dropdown-content">
              <a href="/samenvatting-verkiezingsprogramma.html">Samenvatting Programma</a>
              <a href="/verkiezingsprogramma-compleet.html">Volledig Programma</a>
              <a href="/kieslijst.html">Kieslijst</a>
              <a href="/stellingen-stemwijzer.html">Stellingen Stemwijzer</a>
              <a href="/stellingen-mijnstem.html">Stellingen MijnStem</a>
            </div>
          </li>
          <li><a href="/fractie.html" class="active">Fractie</a></li>
          <li><a href="/contact.html">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container section-padding">
    <article class="raadslid-profiel">
      <h1>${data.naam}</h1>
      <p class="meta">${data.rol}</p>

      ${data.foto ? `
        <div class="raadslid-header">
          <img src="${data.foto}" alt="Foto van ${data.naam}" class="raadslid-foto">
          <div class="raadslid-bio">
            ${htmlBioContent}
          </div>
        </div>
      ` : `
        <div class="raadslid-bio">
          ${htmlBioContent}
        </div>
      `}

      ${data.email ? `<p><a href="mailto:${data.email}">📧 ${data.email}</a></p>` : ''}
      ${data.linkedin ? `<p><a href="${data.linkedin}" target="_blank" rel="noopener noreferrer">🔗 LinkedIn</a></p>` : ''}

      <a href="/fractie.html" class="btn btn-light">← Terug naar fractieoverzicht</a>
    </article>
  </main>

  <footer class="site-footer">
    <div class="container text-center">
      <p>© 2025 Stadspartij Wageningen – Lokaal en Betrokken</p>
      <p>Website door <strong><a href="https://twinpixel.nl" target="_blank" rel="noopener noreferrer">TwinPixel</a></strong></p>
    </div>
  </footer>

  <script src="/js/main.js"></script>
</body>
</html>`;
}
// === STAP 4: GENERATIE PROCESSEN ===

/**
 * Kopieert statische bestanden (HTML, CSS, JS, images, en Netlify CMS admin) van /src naar /public.
 */
function copyStaticFiles() {
  console.log("\n🚀 Kopiëren van statische bestanden...");
  
  const filesToCopy = [
    "contact.html", "fractie.html", "index.html", "kieslijst.html", "nieuws.html",
    "samenvatting-verkiezingsprogramma.html", "stellingen-mijnstem.html",
    "stellingen-stemwijzer.html", "verkiezingsprogramma-compleet.html",
    "verkiezingsprogramma.html"
  ];
  const dirsToCopy = ["css", "js", "images"];

  filesToCopy.forEach(file => {
    const sourcePath = path.join(staticAssetsDir, file);
    if (fs.existsSync(sourcePath)) {
      const destPath = path.join(outputDir, file);
      ensureDirExists(path.dirname(destPath));
      fs.copyFileSync(sourcePath, destPath);
      console.log(`   -> Gekopieerd: ${file}`);
    }
  });

  dirsToCopy.forEach(dir => {
    const sourcePath = path.join(staticAssetsDir, dir);
    if (fs.existsSync(sourcePath)) {
      const destPath = path.join(outputDir, dir);
      fs.cpSync(sourcePath, destPath, { recursive: true });
      console.log(`   -> Map gekopieerd: ${dir}`);
    }
  });
  
  // Kopieer de 'admin' map voor Netlify CMS
  if (fs.existsSync(netlifyCmsDir)) {
    fs.cpSync(netlifyCmsDir, path.join(outputDir, "admin"), { recursive: true });
    console.log(`   -> Netlify CMS map gekopieerd: admin`);
  }
  
  console.log("👍 Statische bestanden gekopieerd.");
}

/**
 * Genereert content (blogs, raadsleden) op een generieke manier.
 * @param {object} config - De configuratie voor het content type.
 * @param {function} marked - De 'marked' parse functie.
 */
function generateContent(config, marked) { // GOED: 'marked' wordt hier ontvangen
  console.log(`\n🚀 Start genereren van ${config.label}...`);
  ensureDirExists(config.outputDir);
  ensureDirExists(dataOutputDir);

  if (!fs.existsSync(config.contentDir)) {
    console.warn(`⚠️ Content map niet gevonden, generatie overgeslagen: ${path.relative(baseDir, config.contentDir)}`);
    return;
  }

  const files = fs.readdirSync(config.contentDir).filter(file => file.toLowerCase().endsWith(".md"));
  const index = [];

  if (files.length === 0) {
    console.warn(`⚠️ Geen .md bestanden gevonden in ${path.relative(baseDir, config.contentDir)}`);
    fs.writeFileSync(path.join(dataOutputDir, config.jsonName), JSON.stringify([], null, 2));
    return;
  }

  files.forEach(file => {
    try {
      const rawContent = fs.readFileSync(path.join(config.contentDir, file), "utf-8");
      const { data, content } = matter(rawContent);
      const slug = path.basename(file, ".md");

      // De 'marked.parse' gebeurt niet meer hier.
      // We roepen de template functie aan met de RUWE content EN de marked functie.
      const fullHtml = config.templateFunction(data, content || "", marked); // GOED

      fs.writeFileSync(path.join(config.outputDir, `${slug}.html`), fullHtml);

      index.push(config.indexItemBuilder(data, slug));
      console.log(`   -> Pagina gegenereerd: ${slug}.html`);
    } catch (error) {
      console.error(`❌ Fout bij verwerken van ${file}:`, error);
    }
  });

  index.sort(config.sortFunction);

  const indexFile = path.join(dataOutputDir, config.jsonName);
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
  console.log(`✅ ${config.label} index gegenereerd.`);
}

// === STAP 5: HOOFDPROGRAMMA DAT ALLES AANSTUURT ===

async function main() {
  // Laad 'marked' hier aan het begin. Het is nu bekend binnen heel 'main'.
  const { marked } = await import('marked');
  
  console.log("===== Stadspartij Wageningen Site Generator =====");

  // 1. Maak de 'public' map schoon
  console.log("\n🧹 Opschonen van de 'public' map...");
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  ensureDirExists(outputDir);
  console.log("👍 'public' map is klaar voor de nieuwe build.");

  // 2. Kopieer alle basisbestanden
  copyStaticFiles();

  // 3. Genereer Blogs
  // GOED: Geef de 'marked' variabele hier mee als tweede argument.
  generateContent({
    label: "Blogs",
    contentDir: blogsContentDir,
    outputDir: blogsOutputDir,
    jsonName: "blogs-index.json",
    templateFunction: createBlogHtmlPage,
    indexItemBuilder: (data, slug) => ({
      title: data.title || "Geen titel",
      date: data.date || "1970-01-01",
      excerpt: data.excerpt || "",
      thumbnail: data.thumbnail || null,
      path: `/blogs/${slug}.html`,
    }),
    sortFunction: (a, b) => new Date(b.date) - new Date(a.date),
  }, marked); // <-- DEZE TOEVOEGING IS CRUCIAAL

  // 4. Genereer Raadsleden
  // GOED: Geef de 'marked' variabele hier ook mee.
  generateContent({
    label: "Raadsleden",
    contentDir: raadsledenContentDir,
    outputDir: raadsledenOutputDir,
    jsonName: "raadsleden-index.json",
    templateFunction: createRaadslidHtmlPage,
    indexItemBuilder: (data, slug) => ({
      naam: data.naam || "Onbekende",
      rol: data.rol || "",
      foto: data.foto || null,
      volgorde: parseInt(data.volgorde || 999, 10),
      path: `/raadsleden/${slug}.html`,
    }),
    sortFunction: (a, b) => a.volgorde - b.volgorde,
  }, marked); // <-- EN DEZE OOK

  console.log("\n✅ Alle taken voltooid!");
  console.log(`   De complete website staat klaar in de map: /public`);
  console.log("===================================================");
}

// Voer het hoofdprogramma uit
main();