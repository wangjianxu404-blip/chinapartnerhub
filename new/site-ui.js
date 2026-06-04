(function () {
    var script = document.currentScript;
    var base = script && script.dataset && script.dataset.base ? script.dataset.base : "";
    var phoneNumber = "+86 180 0545 5057";
    var emailAddress = "info@chinapartnerhub.com";
    var whatsappLink = "https://wa.me/8618005455057";

    function injectStyles() {
        if (document.getElementById("site-ui-styles")) {
            return;
        }

        var style = document.createElement("style");
        style.id = "site-ui-styles";
        style.textContent = [
            ".site-ui-menu-button{display:inline-flex;align-items:center;justify-content:center;width:3rem;height:3rem;border-radius:9999px;border:1px solid rgba(22,32,39,.14);background:rgba(255,255,255,.88);color:#162027;box-shadow:0 10px 24px rgba(22,32,39,.08)}",
            ".site-ui-menu-button:hover{border-color:rgba(12,124,120,.35);color:#0c7c78}",
            ".site-ui-mobile-panel{position:absolute;left:1rem;right:1rem;top:calc(100% + .75rem);border:1px solid rgba(22,32,39,.12);border-radius:1.5rem;background:rgba(248,244,236,.98);backdrop-filter:blur(18px);box-shadow:0 24px 60px rgba(22,32,39,.16);padding:1rem;z-index:60}",
            ".site-ui-mobile-panel[hidden]{display:none!important}",
            ".site-ui-mobile-link{display:block;border-radius:1rem;padding:.95rem 1rem;font-size:.95rem;font-weight:700;color:#162027}",
            ".site-ui-mobile-link:hover{background:rgba(12,124,120,.08);color:#0c7c78}",
            ".site-ui-mobile-link.is-active{background:rgba(12,124,120,.1);color:#0c7c78}",
            ".site-ui-mobile-actions{display:grid;gap:.75rem;margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(22,32,39,.1)}",
            ".site-ui-action{display:flex;align-items:center;justify-content:center;border-radius:9999px;padding:.95rem 1rem;font-size:.92rem;font-weight:800;text-decoration:none}",
            ".site-ui-action--primary{background:linear-gradient(135deg,#0c7c78,#15938d);color:#fff}",
            ".site-ui-action--secondary{border:1px solid rgba(22,32,39,.14);background:#fff;color:#162027}",
            ".site-ui-whatsapp-float{position:fixed;right:1rem;bottom:1rem;z-index:80;display:inline-flex;align-items:center;gap:.65rem;border-radius:9999px;background:linear-gradient(135deg,#0c7c78,#15938d);padding:.9rem 1.1rem;color:#fff;text-decoration:none;box-shadow:0 20px 45px rgba(12,124,120,.28)}",
            ".site-ui-whatsapp-float:hover{filter:brightness(1.04)}",
            ".site-ui-whatsapp-icon{display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;border-radius:9999px;background:rgba(255,255,255,.18);font-size:1rem;font-weight:900}",
            ".site-ui-whatsapp-copy{display:flex;flex-direction:column;line-height:1.1}",
            ".site-ui-whatsapp-copy strong{font-size:.88rem}",
            ".site-ui-whatsapp-copy span{font-size:.72rem;opacity:.92}",
            "@media (min-width: 1024px){.site-ui-menu-button,.site-ui-mobile-panel{display:none!important}}",
            "@media (max-width: 639px){.site-ui-whatsapp-float{right:.75rem;bottom:.75rem;padding:.85rem 1rem}.site-ui-whatsapp-copy span{display:none}}"
        ].join("");
        document.head.appendChild(style);
    }

    function normalizePath(value) {
        return (value || "").replace(/\\/g, "/").replace(/\/index\.html$/, "/").replace(/^\.\//, "");
    }

    function buildMobileNav() {
        var nav = document.querySelector("nav.sticky");
        if (!nav) {
            return;
        }

        var shell = nav.querySelector(":scope > div");
        if (!shell || nav.querySelector(".site-ui-menu-button")) {
            return;
        }

        nav.style.position = nav.style.position || "sticky";

        var actionWrap = shell.querySelector(":scope > div:last-child");
        if (!actionWrap) {
            actionWrap = document.createElement("div");
            actionWrap.className = "flex items-center gap-3";
            shell.appendChild(actionWrap);
        }

        var menuButton = document.createElement("button");
        menuButton.type = "button";
        menuButton.className = "site-ui-menu-button lg:hidden";
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open site navigation");
        menuButton.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>';
        actionWrap.insertBefore(menuButton, actionWrap.firstChild);

        var mobilePanel = document.createElement("div");
        mobilePanel.className = "site-ui-mobile-panel lg:hidden";
        mobilePanel.hidden = true;

        var links = [
            { href: base + "index.html", label: "Home" },
            { href: base + "about.html", label: "About" },
            { href: base + "services.html", label: "Services" },
            { href: base + "verified-suppliers.html", label: "Verified Suppliers" },
            { href: base + "how-it-works.html", label: "How It Works" },
            { href: base + "verification.html", label: "Verification" },
            { href: base + "insights/", label: "Insights" },
            { href: base + "start-project.html", label: "Start Procurement" },
            { href: base + "contact.html", label: "Contact" }
        ];

        var currentPath = normalizePath(window.location.pathname);
        var linksHtml = links.map(function (link) {
            var linkPath = normalizePath(link.href);
            var isActive = currentPath.endsWith(linkPath) || (linkPath === "insights/" && currentPath.indexOf("/insights/") !== -1);
            return '<a href="' + link.href + '" class="site-ui-mobile-link' + (isActive ? ' is-active' : '') + '">' + link.label + "</a>";
        }).join("");

        mobilePanel.innerHTML = linksHtml +
            '<div class="site-ui-mobile-actions">' +
            '<a href="' + whatsappLink + '" target="_blank" rel="noopener noreferrer" class="site-ui-action site-ui-action--primary">Start Procurement</a>' +
            '<a href="mailto:' + emailAddress + '" class="site-ui-action site-ui-action--secondary">Email Us</a>' +
            "</div>";

        nav.appendChild(mobilePanel);

        function closeMenu() {
            mobilePanel.hidden = true;
            menuButton.setAttribute("aria-expanded", "false");
        }

        menuButton.addEventListener("click", function () {
            var isOpen = menuButton.getAttribute("aria-expanded") === "true";
            mobilePanel.hidden = isOpen;
            menuButton.setAttribute("aria-expanded", String(!isOpen));
        });

        document.addEventListener("click", function (event) {
            if (mobilePanel.hidden) {
                return;
            }

            if (!nav.contains(event.target)) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        mobilePanel.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });
    }

    function addFloatingWhatsApp() {
        if (document.querySelector(".site-ui-whatsapp-float")) {
            return;
        }

        var floatingLink = document.createElement("a");
        floatingLink.href = whatsappLink;
        floatingLink.target = "_blank";
        floatingLink.rel = "noopener noreferrer";
        floatingLink.className = "site-ui-whatsapp-float";
        floatingLink.setAttribute("aria-label", "Contact China Partner Hub on WhatsApp");
        floatingLink.innerHTML = '' +
            '<span class="site-ui-whatsapp-icon">WA</span>' +
            '<span class="site-ui-whatsapp-copy"><strong>WhatsApp</strong><span>Start procurement</span></span>';
        document.body.appendChild(floatingLink);
    }

    function labelFooterContact() {
        document.querySelectorAll("footer a[href^='mailto:']").forEach(function (link) {
            var rawText = (link.textContent || "").trim();
            if (rawText && !/^Email:/i.test(rawText)) {
                link.textContent = "Email: " + rawText;
            }
        });

        document.querySelectorAll("footer a[href*='wa.me']").forEach(function (link) {
            var rawText = (link.textContent || "").trim();
            if (rawText && !/^WhatsApp:/i.test(rawText)) {
                link.textContent = "WhatsApp: " + rawText;
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        injectStyles();
        buildMobileNav();
        addFloatingWhatsApp();
        labelFooterContact();
    });
})();
