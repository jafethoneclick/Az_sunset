# AZ Sunset Steel Structures & Carports — sitio estático (HTML/CSS/JS/PHP)

Conversión a HTML/CSS estático del tema WordPress `ironclad-steel`
(mismo diseño Tailwind, mismo contenido demo), con **una carpeta por
página**: cada carpeta contiene el `.html` de la página, su `.css`
propio y, cuando hace falta, su `.js` y `.php`.

## Estructura

```
sitio-html/
  index.html + index.css      Portada (en la raíz, como pediste)
  assets/                     Recursos compartidos por todas las páginas
    css/main.css              Tailwind compilado (el diseño completo)
    css/site.css              Estilos propios compartidos (mega-menú del header)
    js/main.js                Menú móvil (todas las páginas)
    js/motion.js              Animaciones de scroll (solo portada)
    js/shader-hero.js         Fondo animado WebGL del hero (solo portada)
    images/logo/              Logo real: logo.png (original) y
                              logo-header.png (versión liviana usada en
                              header, footer, portal y favicon)
    images/                   Placeholders SVG (hero, productos…)
  products/
    garages/garages.html + garages.css
    carports/ · barns/ · commercial/ · utility-units/ · rv-covers/
    lean-tos/ · combo-units/  (igual: carpeta con html + css)
  pricing/pricing.html + pricing.css
  dealers/
    apply/apply.html + apply.css + apply.js + apply.php + .htaccess
    portal/portal.html + portal.css + portal.js + portal.php  (login)
  about/about.html + about.css
  financing/financing.html + financing.css
  faqs/faqs.html + faqs.css
  contact/contact.html + contact.css + contact.js + contact.php + .htaccess
  terms/terms.html + terms.css
  privacy/privacy.html + privacy.css
  404/404.html + 404.css
```

## Navegación (desplegables por columna)

En escritorio, la barra superior muestra Product · Financing · Pricing ·
Dealers · About Us. Al pasar el mouse (o con Tab) sobre un ítem se
despliega **solo su propio menú**:
**Product** → Garages, Carports, Barns, Commercial Structures, Utility
Units, RV Covers, Lean-Tos · **Financing** → Heartland Capital RTO, HSF
Portal, RTO National · **Pricing** → enlace directo (sin desplegable) ·
**Dealers** → Apply, Portal · **About Us** → Area, Staff, Reviews.
En móvil se usa el menú hamburguesa con los mismos grupos. Los enlaces
de Financing llevan a anclas de la página Financing — cuando tengas las
URLs reales de los portales (HSF, RTO National), cambialas regenerando
el sitio.

El **Dealer Portal** (`dealers/portal/`) es la plantilla de login:
todavía no hay sistema de cuentas, así que `portal.php` siempre
responde "credenciales inválidas". El backend real va ahí.

## Cómo verlo

- **Solo HTML**: abrí `index.html` con doble clic — todo funciona
  menos el envío real del formulario de contacto.
- **Con PHP (formulario funcionando)**: copiá esta carpeta dentro de
  `C:\xampp\htdocs\` y entrá a `http://localhost/sitio-html/`.
  Los envíos del formulario se guardan en `contact/leads.csv` y se
  intenta enviar un correo a la dirección configurada en
  `contact/contact.php` (en XAMPP local el correo no sale, pero el
  CSV siempre se guarda).

## Cómo editar

- **Textos**: directamente en el `.html` de cada carpeta.
- **Colores de marca**: la paleta AZ Sunset vive en el bloque `:root`
  de `assets/css/site.css` (oscuros #121212 / #2A2F35 / #5E666E /
  #B8BEC4, dorado #D89A1F, sol #F4B400, naranja #D66C1D, rojo #98291E,
  claro #F5F5F5) y pisa los valores por defecto de `main.css`.
  Cambiá ahí cualquier color.
- **Estilos de una sola página**: en el `.css` de su carpeta.
- **Imágenes**: reemplazá los SVG placeholder en `assets/images/`
  manteniendo el mismo nombre de archivo.
- **Correo del formulario**: variable `$to` al inicio de
  `contact/contact.php`.

Nota: las clases de diseño son de Tailwind CSS v4 ya compilado en
`assets/css/main.css`; si agregás clases Tailwind *nuevas* en el HTML
que no existan ya en ese archivo, agregá la regla equivalente en el
`.css` de la página.
