const SHANSHUI_REALMS = {
  song: "宋韵",
  tang: "唐韵",
  vintage: "仿古",
  modern: "现代",
  postmodern: "后现代",
};

const SHANSHUI_FILES = {
  1: "01-home.png",
  2: "02-intro.png",
  3: "03-tutorial.png",
  4: "04-project.png",
  5: "05-papers.png",
  6: "06-resources.png",
  7: "07-gallery.png",
};

function shanshuiStorageKey(scene) {
  return `mvai-shanshui-realm:scene-${String(scene).padStart(2, "0")}`;
}

function readShanshuiRealm(scene) {
  try {
    const realm = localStorage.getItem(shanshuiStorageKey(scene));
    return Object.hasOwn(SHANSHUI_REALMS, realm) ? realm : "song";
  } catch (error) {
    return "song";
  }
}

function writeShanshuiRealm(scene, realm) {
  try {
    localStorage.setItem(shanshuiStorageKey(scene), realm);
  } catch (error) {
    // A blocked localStorage must not prevent the default image from rendering.
  }
}

function updateShanshui(component, realm) {
  const scene = Number(component.dataset.shanshuiScene);
  const filename = SHANSHUI_FILES[scene];
  const label = SHANSHUI_REALMS[realm];
  const root = component.dataset.shanshuiRoot.replace(/\/$/, "");
  const image = component.querySelector(".mv-shanshui__image");
  const current = component.querySelector("[data-shanshui-current]");

  if (!filename || !label || !image || !current) return;

  image.src = `${root}/${realm}/${filename}`;
  image.alt = `山水五境 · ${label}`;
  image.dataset.shanshuiRealm = realm;
  current.textContent = label;

  component.querySelectorAll("[data-shanshui-realm]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.shanshuiRealm === realm));
  });
}

function currentFullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

async function toggleShanshuiFullscreen(component) {
  if (currentFullscreenElement() === component) {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    return;
  }

  const requestFullscreen = component.requestFullscreen || component.webkitRequestFullscreen;
  if (!requestFullscreen) return;

  if (currentFullscreenElement()) {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  await requestFullscreen.call(component);
}

function syncShanshuiFullscreenState() {
  const active = currentFullscreenElement();
  document.querySelectorAll("[data-shanshui]").forEach((component) => {
    const button = component.querySelector("[data-shanshui-fullscreen]");
    if (!button) return;
    const isActive = active === component;
    button.setAttribute("aria-pressed", String(isActive));
    button.title = isActive ? "退出全屏" : "全屏欣赏";
  });
}

function initShanshui() {
  document.querySelectorAll("[data-shanshui]").forEach((component) => {
    if (component.dataset.shanshuiInitialized === "true") return;

    const scene = Number(component.dataset.shanshuiScene);
    const picker = component.querySelector(".mv-shanshui__picker");
    const image = component.querySelector(".mv-shanshui__image");
    const fullscreenButton = component.querySelector("[data-shanshui-fullscreen]");
    const realm = readShanshuiRealm(scene);

    component.dataset.shanshuiInitialized = "true";
    updateShanshui(component, realm);

    component.querySelectorAll("[data-shanshui-realm]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextRealm = button.dataset.shanshuiRealm;
        if (!Object.hasOwn(SHANSHUI_REALMS, nextRealm)) return;

        writeShanshuiRealm(scene, nextRealm);
        updateShanshui(component, nextRealm);
        if (picker) picker.open = false;
      });
    });

    if (fullscreenButton) {
      fullscreenButton.addEventListener("click", () => {
        toggleShanshuiFullscreen(component).catch(() => {
          // Fullscreen may be unavailable or denied; keep the page usable.
        });
      });
    }

    if (image) {
      image.addEventListener("error", () => {
        if (image.dataset.shanshuiRealm !== "song") updateShanshui(component, "song");
      }, { once: true });
    }
  });
}

document.addEventListener("fullscreenchange", syncShanshuiFullscreenState);
document.addEventListener("webkitfullscreenchange", syncShanshuiFullscreenState);

if (typeof document$ !== "undefined") {
  document$.subscribe(initShanshui);
} else {
  document.addEventListener("DOMContentLoaded", initShanshui);
}
