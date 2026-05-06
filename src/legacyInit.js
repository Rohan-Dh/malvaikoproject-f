export function initLegacyPage() {
  "use strict";
const CONFIG = {
        business: {
          name: "WHO BROKiT",
          tagline: "We Fix It.",
          location: "Parramatta, NSW",
          phone: "0426 003 738",
          email: "whobrokit@gmail.com",
          year: new Date().getFullYear(),
        },
        services: [
          { device: "phone", label: "Screen replacement", price: "$49–$199" },
          { device: "phone", label: "Battery replacement", price: "$59–$89" },
          { device: "phone", label: "Charging port repair", price: "$69–$109" },
          { device: "phone", label: "Water damage", price: "$79–$149" },
          { device: "ipad", label: "Screen replacement", price: "$99–$249" },
          { device: "ipad", label: "Battery replacement", price: "$89–$129" },
          { device: "ipad", label: "Software reset", price: "$79–$99" },
          { device: "tablet", label: "Screen replacement", price: "$79–$179" },
          { device: "tablet", label: "Battery replacement", price: "$69–$99" },
          { device: "tablet", label: "Charging port repair", price: "$59–$89" },
          { device: "laptop", label: "Screen replacement", price: "$149–$299" },
          { device: "laptop", label: "Battery replacement", price: "$99–$179" },
          { device: "laptop", label: "Virus removal", price: "$89–$129" },
          { device: "laptop", label: "SSD / RAM upgrade", price: "$99–$249" },
          { device: "laptop", label: "OS reinstall", price: "$89–$119" },
          { device: "desktop", label: "Virus removal", price: "$89–$129" },
          {
            device: "desktop",
            label: "RAM / storage upgrade",
            price: "$99–$219",
          },
          { device: "desktop", label: "OS reinstall", price: "$89–$119" },
          { device: "desktop", label: "Data recovery", price: "$149–$399" },
          { device: "phone", label: "Data recovery", price: "$130–$299" },
          { device: "ipad", label: "Data recovery", price: "$130–$299" },
          { device: "tablet", label: "Data recovery", price: "$130–$299" },
          { device: "laptop", label: "Data recovery", price: "$130–$399" },
        ],
        faqs: [
          {
            q: "How long does a repair take?",
            a: "Most common repairs — screen replacements, battery swaps — are done within 1–2 hours. More complex jobs may take longer, but we'll always give you a realistic estimate upfront before we start.",
          },
          {
            q: "Do you offer pickup and delivery?",
            a: "Yes. We come to you. Pickup and delivery is available across Parramatta, NSW. Select that option in the booking form and we'll confirm a convenient time.",
          },
          {
            q: "Is there a warranty on repairs?",
            a: "All repairs come with a 180-day (6-month) warranty covering the parts and labour involved. If anything goes wrong with the same repair, we'll fix it at no additional cost.",
          },
          {
            q: "What brands do you repair?",
            a: "We repair all major brands — Apple, Samsung, Google, Huawei, Oppo, Xiaomi, Lenovo, HP, Dell, and more. Not sure if we can help? Just ask.",
          },
          {
            q: "Will I lose my data?",
            a: "Most repairs don't affect your data. We recommend backing up your device before any repair. We'll tell you clearly if there's any risk to your data before we begin work.",
          },
          {
            q: "What if you can't fix it?",
            a: "If we can't fix your device, you don't pay. Simple as that. We'll let you know our honest assessment so you can decide the best path forward.",
          },
          {
            q: "Do you use genuine parts?",
            a: "We use high-quality parts sourced from reputable suppliers. We'll always tell you exactly what parts are being used and give you options where available.",
          },
          {
            q: "Do you sell refurbished phones?",
            a: "Yes — mainly refurbished iPhones, fully tested, data-wiped, and sold with warranty. Stock and prices change often; message or call us with your budget and preferred model and we'll tell you what's available for pickup or delivery in Parramatta.",
          },
        ],
      };

      const B = CONFIG.business;
      function phoneDigitsInternational(phone) {
        const d = phone.replace(/\D/g, "");
        if (d.startsWith("0") && d.length >= 9) return "61" + d.slice(1);
        if (d.startsWith("61")) return d;
        return d;
      }
      document.getElementById("cd-location").textContent = B.location;
      const phoneLink = document.getElementById("cd-phone-link");
      phoneLink.textContent = B.phone;
      phoneLink.href = "tel:+" + phoneDigitsInternational(B.phone);
      const emailLink = document.getElementById("cd-email-link");
      emailLink.textContent = B.email;
      emailLink.href = "mailto:" + B.email;
      document.getElementById("footer-left").textContent =
        `© ${B.year} ${B.name} — ${B.location}`;
      document.getElementById("footer-right").textContent =
        `${B.email} · ${B.phone}`;

      const mainNav = document.getElementById("main-nav");
      const hamburger = document.getElementById("hamburger");
      const navMobile = document.getElementById("nav-mobile");

      window.addEventListener(
        "scroll",
        () => {
          mainNav.classList.toggle("scrolled", window.scrollY > 20);
        },
        { passive: true },
      );

      hamburger.addEventListener("click", () => {
        const open = navMobile.classList.toggle("open");
        hamburger.setAttribute("aria-expanded", open);
      });

      // Close mobile menu on scroll (mobile UX)
      window.addEventListener(
        "scroll",
        () => {
          if (navMobile.classList.contains("open")) {
            navMobile.classList.remove("open");
            hamburger.setAttribute("aria-expanded", "false");
          }
        },
        { passive: true },
      );
      navMobile.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          navMobile.classList.remove("open");
          hamburger.setAttribute("aria-expanded", "false");
        });
      });

      // ── PRICE ESTIMATOR DATA ──────────────────────────────────────────────
      const EST_DATA = {
        Apple: {
          models: [
            "iPhone 16 Pro Max",
            "iPhone 16 Pro",
            "iPhone 16 Plus",
            "iPhone 16",
            "iPhone 15 Pro Max",
            "iPhone 15 Pro",
            "iPhone 15 Plus",
            "iPhone 15",
            "iPhone 14 Pro Max",
            "iPhone 14 Pro",
            "iPhone 14 Plus",
            "iPhone 14",
            "iPhone 13 Pro Max",
            "iPhone 13 Pro",
            "iPhone 13 Mini",
            "iPhone 13",
            "iPhone 12 Pro Max",
            "iPhone 12 Pro",
            "iPhone 12 Mini",
            "iPhone 12",
            "iPhone 11 Pro Max",
            "iPhone 11 Pro",
            "iPhone 11",
            "iPhone XS Max",
            "iPhone XS",
            "iPhone XR",
            "iPhone X",
            "iPhone SE (3rd gen)",
            "iPhone SE (2nd gen)",
            "iPad Pro 12.9-inch",
            "iPad Pro 11-inch",
            "iPad Air",
            "iPad Mini",
            "iPad (standard)",
            "MacBook Pro",
            "MacBook Air",
            "iMac",
            "Mac Mini",
          ],
          repairs: {
            "Screen Repair": "$49–$299",
            "Battery Replacement": "$59–$129",
            "Charging Port Repair": "$69–$109",
            "Water Damage Recovery": "$79–$149",
            "Back Glass Repair": "$69–$149",
            "Camera Repair": "$89–$199",
            "Speaker / Mic Fix": "$69–$119",
            "Software Reset / DFU": "$59–$99",
            "Data Recovery": "$99–$299",
            "SSD / RAM Upgrade": "$99–$249",
            "Virus Removal": "$89–$129",
            "OS Reinstall": "$89–$119",
          },
        },
        Samsung: {
          models: [
            "Galaxy S25 Ultra",
            "Galaxy S25+",
            "Galaxy S25",
            "Galaxy S24 Ultra",
            "Galaxy S24+",
            "Galaxy S24",
            "Galaxy S24 FE",
            "Galaxy S23 Ultra",
            "Galaxy S23+",
            "Galaxy S23",
            "Galaxy S23 FE",
            "Galaxy S22 Ultra",
            "Galaxy S22+",
            "Galaxy S22",
            "Galaxy S21 Ultra",
            "Galaxy S21+",
            "Galaxy S21",
            "Galaxy S21 FE",
            "Galaxy A55",
            "Galaxy A35",
            "Galaxy A25",
            "Galaxy A15",
            "Galaxy A05",
            "Galaxy Z Fold 6",
            "Galaxy Z Fold 5",
            "Galaxy Z Flip 6",
            "Galaxy Z Flip 5",
            "Galaxy Tab S10+",
            "Galaxy Tab S9",
            "Galaxy Tab A9",
          ],
          repairs: {
            "Screen Repair": "$79–$249",
            "Battery Replacement": "$59–$99",
            "Charging Port Repair": "$69–$109",
            "Water Damage Recovery": "$79–$149",
            "Back Glass Repair": "$69–$129",
            "Camera Repair": "$89–$179",
            "Speaker / Mic Fix": "$69–$119",
            "Software Reset": "$59–$89",
            "Data Recovery": "$99–$299",
          },
        },
        Google: {
          models: [
            "Pixel 9 Pro XL",
            "Pixel 9 Pro",
            "Pixel 9",
            "Pixel 9a",
            "Pixel 8 Pro",
            "Pixel 8",
            "Pixel 8a",
            "Pixel 7 Pro",
            "Pixel 7",
            "Pixel 7a",
            "Pixel 6 Pro",
            "Pixel 6",
            "Pixel 6a",
            "Pixel Fold",
            "Pixel Tablet",
          ],
          repairs: {
            "Screen Repair": "$79–$229",
            "Battery Replacement": "$69–$99",
            "Charging Port Repair": "$69–$109",
            "Water Damage Recovery": "$79–$149",
            "Back Glass Repair": "$69–$129",
            "Camera Repair": "$89–$169",
            "Software Reset": "$59–$89",
            "Data Recovery": "$99–$299",
          },
        },
        Oppo: {
          models: [
            "Find X8 Pro",
            "Find X8",
            "Find X7 Pro",
            "Find X7",
            "Reno 12 Pro",
            "Reno 12",
            "Reno 11 Pro",
            "Reno 11",
            "A98",
            "A78",
            "A58",
            "A38",
            "A18",
          ],
          repairs: {
            "Screen Repair": "$69–$199",
            "Battery Replacement": "$59–$89",
            "Charging Port Repair": "$59–$99",
            "Water Damage Recovery": "$79–$149",
            "Camera Repair": "$79–$149",
            "Software Reset": "$59–$89",
            "Data Recovery": "$99–$299",
          },
        },
        Xiaomi: {
          models: [
            "14 Ultra",
            "14 Pro",
            "14",
            "13 Ultra",
            "13 Pro",
            "Redmi Note 13 Pro+",
            "Redmi Note 13 Pro",
            "Redmi Note 13",
            "Redmi 13C",
            "POCO X6 Pro",
            "POCO X6",
            "POCO M6 Pro",
          ],
          repairs: {
            "Screen Repair": "$69–$189",
            "Battery Replacement": "$59–$89",
            "Charging Port Repair": "$59–$99",
            "Water Damage Recovery": "$79–$149",
            "Camera Repair": "$79–$149",
            "Software Reset": "$59–$89",
            "Data Recovery": "$99–$299",
          },
        },
        Huawei: {
          models: [
            "Mate 60 Pro",
            "Mate 50 Pro",
            "P60 Pro",
            "P50 Pro",
            "Nova 11 Pro",
            "Nova 10 Pro",
            "Y90",
            "Y70",
            "Y61",
          ],
          repairs: {
            "Screen Repair": "$79–$199",
            "Battery Replacement": "$59–$89",
            "Charging Port Repair": "$59–$99",
            "Water Damage Recovery": "$79–$149",
            "Camera Repair": "$79–$149",
            "Software Reset": "$59–$89",
            "Data Recovery": "$99–$299",
          },
        },
        Sony: {
          models: [
            "Xperia 1 VI",
            "Xperia 5 VI",
            "Xperia 10 VI",
            "Xperia 1 V",
            "Xperia 5 V",
            "Xperia 10 V",
          ],
          repairs: {
            "Screen Repair": "$79–$219",
            "Battery Replacement": "$69–$99",
            "Charging Port Repair": "$69–$109",
            "Water Damage Recovery": "$79–$149",
            "Camera Repair": "$89–$169",
            "Data Recovery": "$99–$299",
          },
        },
        OnePlus: {
          models: [
            "13",
            "12",
            "12R",
            "11",
            "10 Pro",
            "Nord 4",
            "Nord CE 4",
            "Nord CE 3 Lite",
          ],
          repairs: {
            "Screen Repair": "$69–$199",
            "Battery Replacement": "$59–$89",
            "Charging Port Repair": "$59–$99",
            "Water Damage Recovery": "$79–$149",
            "Camera Repair": "$79–$149",
            "Software Reset": "$59–$89",
            "Data Recovery": "$99–$299",
          },
        },
        Motorola: {
          models: [
            "Edge 50 Pro",
            "Edge 50",
            "Edge 40 Pro",
            "Edge 40",
            "G85",
            "G75",
            "G55",
            "G45",
            "G35",
            "G24",
            "Razr 50 Ultra",
            "Razr 50",
          ],
          repairs: {
            "Screen Repair": "$69–$189",
            "Battery Replacement": "$59–$89",
            "Charging Port Repair": "$59–$99",
            "Water Damage Recovery": "$79–$149",
            "Camera Repair": "$79–$149",
            "Data Recovery": "$99–$299",
          },
        },
        Laptop: {
          models: [
            "Dell XPS / Inspiron / Latitude",
            "HP Spectre / Envy / Pavilion",
            "Lenovo ThinkPad / IdeaPad / Yoga",
            "Asus ZenBook / VivoBook / ROG",
            "Acer Swift / Aspire / Predator",
            "Microsoft Surface Pro / Laptop",
            "Razer Blade",
            "Toshiba / Dynabook",
            "Other Windows Laptop",
          ],
          repairs: {
            "Screen Replacement": "$149–$299",
            "Battery Replacement": "$99–$179",
            "Keyboard Replacement": "$99–$199",
            "Charging Port Repair": "$89–$149",
            "Virus Removal": "$89–$129",
            "SSD Upgrade": "$99–$249",
            "RAM Upgrade": "$79–$149",
            "OS Reinstall": "$89–$119",
            "Data Recovery": "$149–$399",
            "Fan / Overheating Fix": "$89–$149",
            "Power Jack Repair": "$89–$149",
          },
        },
        Desktop: {
          models: [
            "Dell Desktop",
            "HP Desktop",
            "Lenovo Desktop",
            "Asus Desktop",
            "Custom Build / Gaming PC",
            "iMac",
            "Mac Mini",
            "Mac Pro",
          ],
          repairs: {
            "Virus Removal": "$89–$129",
            "RAM / Storage Upgrade": "$99–$219",
            "OS Reinstall": "$89–$119",
            "Data Recovery": "$149–$399",
            "Power Supply Repair": "$99–$179",
            "GPU / Graphics Issue": "$99–$199",
            "Cooling / Fan Repair": "$79–$139",
            "Network Card / WiFi": "$79–$129",
          },
        },
        "Other / Not Listed": {
          models: ["My device isn't listed above"],
          repairs: {
            "Custom quote — contact us": "Quote on request",
          },
        },
      };

      // ── ESTIMATOR WIRING ─────────────────────────────────────────────────
      const estBrand = document.getElementById("est-brand");
      const estModel = document.getElementById("est-model");
      const estRepair = document.getElementById("est-repair");
      const estPrice = document.getElementById("est-price");

      // Populate brands
      Object.keys(EST_DATA).forEach((brand) =>
        estBrand.add(new Option(brand, brand)),
      );

      function setPending(sel, msg) {
        sel.replaceChildren(new Option(msg, ""));
        sel.classList.add("est-repair-pending");
      }
      function setReady(sel) {
        sel.classList.remove("est-repair-pending");
      }

      estBrand.addEventListener("change", () => {
        estPrice.textContent = "—";
        const brand = estBrand.value;
        if (!brand) {
          setPending(estModel, "Select brand first");
          setPending(estRepair, "Select model first");
          return;
        }
        const data = EST_DATA[brand];
        setReady(estModel);
        const frag = document.createDocumentFragment();
        frag.appendChild(new Option("Select model...", ""));
        data.models.forEach((m) => frag.appendChild(new Option(m, m)));
        estModel.replaceChildren(frag);
        setPending(estRepair, "Select model first");
      });

      estModel.addEventListener("change", () => {
        estPrice.textContent = "—";
        const brand = estBrand.value;
        const model = estModel.value;
        if (!brand || !model) {
          setPending(estRepair, "Select model first");
          return;
        }
        const repairs = EST_DATA[brand].repairs;
        setReady(estRepair);
        const frag = document.createDocumentFragment();
        frag.appendChild(new Option("Select repair...", ""));
        Object.entries(repairs).forEach(([label, price]) =>
          frag.appendChild(new Option(label, price)),
        );
        estRepair.replaceChildren(frag);
      });

      estRepair.addEventListener("change", () => {
        const v = estRepair.value;
        estPrice.textContent = v || "—";
      });

      const faqList = document.getElementById("faq-list");
      CONFIG.faqs.forEach((item, i) => {
        const id = `faq-body-${i}`;
        const dt = document.createElement("dt");
        dt.className = "faq-item";
        dt.setAttribute("data-open", "false");
        dt.innerHTML = `<button class="faq-btn" aria-expanded="false" aria-controls="${id}" id="faq-btn-${i}"><span>${item.q}</span><span class="faq-icon" aria-hidden="true"></span></button>`;
        const dd = document.createElement("dd");
        dd.className = "faq-body";
        dd.id = id;
        dd.setAttribute("role", "region");
        dd.setAttribute("aria-labelledby", `faq-btn-${i}`);
        dd.innerHTML = `<div class="faq-body-inner">${item.a}</div>`;
        faqList.appendChild(dt);
        faqList.appendChild(dd);
        dt.querySelector(".faq-btn").addEventListener("click", () => {
          const isOpen = dt.getAttribute("data-open") === "true";
          faqList.querySelectorAll(".faq-item").forEach((el) => {
            el.setAttribute("data-open", "false");
            el.querySelector(".faq-btn").setAttribute("aria-expanded", "false");
          });
          faqList.querySelectorAll(".faq-body").forEach((el) => {
            el.style.maxHeight = "0";
          });
          if (!isOpen) {
            dt.setAttribute("data-open", "true");
            dt.querySelector(".faq-btn").setAttribute("aria-expanded", "true");
            dd.style.maxHeight = dd.scrollHeight + "px";
          }
        });
      });

      const form = document.getElementById("contact-form");
      const formMsg = document.getElementById("form-msg");
      const formBtn = document.getElementById("form-submit");
      const API_BASE_URL =
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "localhost"
          ? "http://[::1]:8080"
          : "https://api.whobrokit.com";

      function showMsg(type, text) {
        formMsg.className = "form-msg " + type;
        formMsg.textContent = text;
        formMsg.style.display = "block";
      }

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("f-name").value.trim();
        const phone = document.getElementById("f-phone").value.trim();
        const email = document.getElementById("f-email").value.trim();
        const device = document.getElementById("f-device").value.trim();
        const service = document.getElementById("f-service").value.trim();
        const message = document.getElementById("f-msg").value.trim();
        if (!name || !email || !message) {
          showMsg("error", "Please fill in all required fields.");
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showMsg("error", "Please enter a valid email address.");
          return;
        }
        formBtn.disabled = true;
        formBtn.textContent = "Sending…";
        try {
          const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              phone,
              email,
              device,
              service,
              message,
            }),
          });

          const body = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(body.message || "Server rejected the request.");
          }

          showMsg("success", "Thanks! We'll be in touch within a few hours.");
          form.reset();
        } catch (err) {
          showMsg(
            "error",
            (err && err.message ? err.message : "Something went wrong.") +
              " Please email us directly at " +
              CONFIG.business.email,
          );
        } finally {
          formBtn.disabled = false;
          formBtn.textContent = "Send enquiry";
        }
      });

      const waBtn = document.getElementById("whatsapp-float");
      if (waBtn) {
        const waPhone = phoneDigitsInternational(CONFIG.business.phone);
        const waText = encodeURIComponent(
          "Hi! I have a question about a repair.",
        );
        waBtn.href = `https://wa.me/${waPhone}?text=${waText}`;
        waBtn.target = "_blank";
        waBtn.rel = "noopener noreferrer";
      }

      // Fallback: if IntersectionObserver not supported, show all reveals immediately
      if (!("IntersectionObserver" in window)) {
        document
          .querySelectorAll(".reveal")
          .forEach((el) => el.classList.add("visible"));
      }
      // Scroll reveal
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 },
      );
      document
        .querySelectorAll(".reveal")
        .forEach((el) => revealObserver.observe(el));
}
